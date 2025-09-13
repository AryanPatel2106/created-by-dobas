import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Gift, Trophy, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const LoyaltyWidget = ({ showOnPages = ['home', 'product', 'checkout'] }) => {
  const { user } = useAuth();
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLoyaltyData();
    }
  }, [user]);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/loyalty/profile/${user.id}`);
      setLoyaltyData(data);
    } catch (error) {
      console.error('Failed to fetch loyalty data:', error);
    } finally {
      setLoading(false);
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

  if (!user || !isVisible || loading) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-xl text-white overflow-hidden max-w-sm">
          {/* Collapsed State */}
          {!isExpanded && (
            <motion.div
              initial={{ height: 'auto' }}
              className="p-4 cursor-pointer"
              onClick={() => setIsExpanded(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-xl">{loyaltyData?.tier?.icon}</div>
                  <div>
                    <div className="font-bold text-sm">{loyaltyData?.points || 0} Points</div>
                    <div className="text-xs opacity-90">{loyaltyData?.tier?.name} Member</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsVisible(false);
                    }}
                    className="p-1 hover:bg-white/20 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Expanded State */}
          {isExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              className="p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">Loyalty Rewards</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Points Display */}
                <div className="text-center">
                  <div className="text-2xl font-bold">{loyaltyData?.points || 0}</div>
                  <div className="text-sm opacity-90">Points Available</div>
                </div>

                {/* Tier Status */}
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-lg">{loyaltyData?.tier?.icon}</span>
                  <span className="font-semibold">{loyaltyData?.tier?.name}</span>
                </div>

                {/* Progress to Next Tier */}
                {loyaltyData?.nextTier && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress to {loyaltyData.nextTier.name}</span>
                      <span>{loyaltyData.pointsToNextTier} to go</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5">
                      <div 
                        className="bg-white rounded-full h-1.5 transition-all duration-500"
                        style={{ width: `${getTierProgress()}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div>
                    <div className="font-bold">{loyaltyData?.totalPointsEarned || 0}</div>
                    <div className="opacity-75">Total Earned</div>
                  </div>
                  <div>
                    <div className="font-bold">{loyaltyData?.redeemedRewards?.length || 0}</div>
                    <div className="opacity-75">Rewards Used</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Link
                    to="/loyalty"
                    className="flex-1 bg-white/20 hover:bg-white/30 text-center py-2 px-3 rounded text-sm font-medium transition-colors"
                  >
                    View Rewards
                  </Link>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="px-3 py-2 text-sm opacity-75 hover:opacity-100 transition-opacity"
                  >
                    Hide
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoyaltyWidget;
