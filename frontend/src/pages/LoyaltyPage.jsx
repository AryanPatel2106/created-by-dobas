import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Gift, Trophy, Clock, ShoppingBag, Award, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const LoyaltyPage = () => {
  const { user } = useAuth();
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      fetchLoyaltyData();
      fetchRewards();
      fetchPointsHistory();
    }
  }, [user]);

  const fetchLoyaltyData = async () => {
    try {
      const { data } = await api.get(`/api/loyalty/profile/${user.id}`);
      setLoyaltyData(data);
    } catch (error) {
      console.error('Failed to fetch loyalty data:', error);
      setError('Failed to load loyalty information');
    }
  };

  const fetchRewards = async () => {
    try {
      const { data } = await api.get(`/api/loyalty/rewards?userId=${user.id}`);
      setRewards(data.rewards || []);
    } catch (error) {
      console.error('Failed to fetch rewards:', error);
    }
  };

  const fetchPointsHistory = async () => {
    try {
      const { data } = await api.get(`/api/loyalty/history/${user.id}`);
      setPointsHistory(data.history || []);
    } catch (error) {
      console.error('Failed to fetch points history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemReward = async (rewardId) => {
    try {
      const { data } = await api.post('/api/loyalty/redeem', {
        userId: user.id,
        rewardId
      });
      
      // Show success message
      alert(data.message);
      
      // Refresh data
      fetchLoyaltyData();
      fetchRewards();
      fetchPointsHistory();
    } catch (error) {
      console.error('Failed to redeem reward:', error);
      alert(error.response?.data?.message || 'Failed to redeem reward');
    }
  };

  const getTierProgress = () => {
    if (!loyaltyData || !loyaltyData.nextTier) return 100;
    const currentPoints = loyaltyData.points;
    const currentTierMin = loyaltyData.tier.minPoints;
    const nextTierMin = loyaltyData.nextTier.minPoints;
    const progress = ((currentPoints - currentTierMin) / (nextTierMin - currentTierMin)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your loyalty rewards</p>
          <a href="/login" className="bg-[var(--theme-pink)] text-gray-800 font-bold py-3 px-6 rounded-lg hover:bg-[var(--theme-pink-hover)] transition-all">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading your loyalty rewards..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorMessage message={error} onRetry={fetchLoyaltyData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Loyalty Rewards</h1>
          <p className="text-gray-600">Earn points with every purchase and unlock amazing rewards</p>
        </motion.div>

        {/* Loyalty Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white mb-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user.given_name}!</h2>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{loyaltyData?.tier?.icon}</span>
                <span className="text-xl font-semibold">{loyaltyData?.tier?.name} Member</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{loyaltyData?.points || 0}</div>
              <div className="text-sm opacity-90">Points Available</div>
            </div>
          </div>

          {/* Progress to Next Tier */}
          {loyaltyData?.nextTier && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Progress to {loyaltyData.nextTier.name}</span>
                <span className="text-sm">{loyaltyData.pointsToNextTier} points to go</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500"
                  style={{ width: `${getTierProgress()}%` }}
                />
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <div className="text-lg font-bold">{loyaltyData?.totalPointsEarned || 0}</div>
              <div className="text-xs opacity-90">Total Earned</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">${loyaltyData?.totalSpent || 0}</div>
              <div className="text-xs opacity-90">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{loyaltyData?.redeemedRewards?.length || 0}</div>
              <div className="text-xs opacity-90">Rewards Used</div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-lg">
          {[
            { id: 'overview', label: 'Overview', icon: Star },
            { id: 'rewards', label: 'Rewards', icon: Gift },
            { id: 'history', label: 'History', icon: Clock }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[var(--theme-pink)] text-gray-800 shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Tier Benefits */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Your {loyaltyData?.tier?.name} Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {loyaltyData?.tier?.benefits?.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Sparkles className="w-4 h-4 text-[var(--theme-pink)]" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Tiers Overview */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Loyalty Tiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {loyaltyData?.allTiers?.map((tier) => (
                    <div
                      key={tier.id}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        tier.id === loyaltyData.tier.id
                          ? 'border-[var(--theme-pink)] bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center mb-3">
                        <div className="text-2xl mb-1">{tier.icon}</div>
                        <div className="font-bold text-gray-800">{tier.name}</div>
                        <div className="text-sm text-gray-600">{tier.minPoints}+ points</div>
                      </div>
                      <div className="space-y-1">
                        {tier.benefits.slice(0, 2).map((benefit, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            • {benefit}
                          </div>
                        ))}
                        {tier.benefits.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{tier.benefits.length - 2} more benefits
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Available Rewards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-lg p-4 transition-all ${
                      reward.canAfford
                        ? 'border-green-200 bg-green-50 hover:shadow-md'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-800">{reward.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{reward.description}</p>
                      </div>
                      <Gift className={`w-5 h-5 ${reward.canAfford ? 'text-green-500' : 'text-gray-400'}`} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-[var(--theme-pink)]">
                        {reward.pointsCost} points
                      </div>
                      <button
                        onClick={() => handleRedeemReward(reward.id)}
                        disabled={!reward.canAfford}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          reward.canAfford
                            ? 'bg-[var(--theme-pink)] text-gray-800 hover:bg-[var(--theme-pink-hover)]'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {reward.canAfford ? 'Redeem' : 'Not enough points'}
                      </button>
                    </div>
                    
                    {reward.minOrderValue > 0 && (
                      <div className="text-xs text-gray-500 mt-2">
                        Min. order: ${reward.minOrderValue}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Points History</h3>
              <div className="space-y-4">
                {pointsHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No points history yet. Start shopping to earn points!</p>
                  </div>
                ) : (
                  pointsHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          entry.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {entry.type === 'earned' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <Gift className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{entry.description}</div>
                          <div className="text-sm text-gray-500">{formatDate(entry.date)}</div>
                        </div>
                      </div>
                      <div className={`font-bold ${
                        entry.type === 'earned' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.type === 'earned' ? '+' : ''}{entry.points} points
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LoyaltyPage;
