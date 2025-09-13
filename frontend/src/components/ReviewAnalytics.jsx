import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Award, Users, ThumbsUp } from 'lucide-react';

const ReviewAnalytics = ({ reviews }) => {
  const getAnalytics = () => {
    if (!reviews || reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recommendationRate: 0,
        verifiedPurchaseRate: 0,
        recentTrend: 'stable'
      };
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
    
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let recommendCount = 0;
    let verifiedCount = 0;
    
    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
      if (review.wouldRecommend) recommendCount++;
      if (review.verifiedPurchase) verifiedCount++;
    });

    // Calculate recent trend (last 5 reviews vs previous 5)
    let recentTrend = 'stable';
    if (reviews.length >= 10) {
      const recent5 = reviews.slice(0, 5);
      const previous5 = reviews.slice(5, 10);
      const recentAvg = recent5.reduce((sum, r) => sum + r.rating, 0) / 5;
      const previousAvg = previous5.reduce((sum, r) => sum + r.rating, 0) / 5;
      
      if (recentAvg > previousAvg + 0.3) recentTrend = 'improving';
      else if (recentAvg < previousAvg - 0.3) recentTrend = 'declining';
    }

    return {
      averageRating: averageRating.toFixed(1),
      totalReviews,
      ratingDistribution,
      recommendationRate: ((recommendCount / totalReviews) * 100).toFixed(0),
      verifiedPurchaseRate: ((verifiedCount / totalReviews) * 100).toFixed(0),
      recentTrend
    };
  };

  const analytics = getAnalytics();

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= Math.round(parseFloat(analytics.averageRating))
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getTrendIcon = () => {
    switch (analytics.recentTrend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'declining':
        return <TrendingUp className="w-5 h-5 text-red-600 transform rotate-180" />;
      default:
        return <TrendingUp className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (analytics.recentTrend) {
      case 'improving':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'declining':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (analytics.totalReviews === 0) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No Reviews Yet</h3>
          <p className="text-gray-500">Be the first to share your experience!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Review Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Average Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-3xl font-bold text-gray-800 mb-2">
            {analytics.averageRating}
          </div>
          {renderStars(analytics.averageRating)}
          <p className="text-sm text-gray-600 mt-2">Average Rating</p>
          <p className="text-xs text-gray-500">{analytics.totalReviews} reviews</p>
        </motion.div>

        {/* Recommendation Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <Award className="w-8 h-8 text-[var(--theme-pink)]" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {analytics.recommendationRate}%
          </div>
          <p className="text-sm text-gray-600">Would Recommend</p>
        </motion.div>

        {/* Verified Purchases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {analytics.verifiedPurchaseRate}%
          </div>
          <p className="text-sm text-gray-600">Verified Purchases</p>
        </motion.div>

        {/* Recent Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-2">
            {getTrendIcon()}
          </div>
          <div className={`text-sm font-medium px-3 py-1 rounded-full border ${getTrendColor()}`}>
            {analytics.recentTrend.charAt(0).toUpperCase() + analytics.recentTrend.slice(1)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Recent Trend</p>
        </motion.div>
      </div>

      {/* Rating Distribution */}
      <div className="mt-8">
        <h4 className="text-lg font-medium text-gray-800 mb-4">Rating Distribution</h4>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = analytics.ratingDistribution[rating];
            const percentage = analytics.totalReviews > 0 ? (count / analytics.totalReviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                </div>
                
                <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: rating * 0.1 }}
                    className="bg-gradient-to-r from-[var(--theme-pink)] to-pink-400 h-full rounded-full"
                  />
                </div>
                
                <div className="flex items-center gap-2 w-16 text-sm text-gray-600">
                  <span>{count}</span>
                  <span className="text-xs">({percentage.toFixed(0)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insights */}
      {analytics.totalReviews >= 5 && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-lg font-medium text-blue-800 mb-2 flex items-center gap-2">
            <ThumbsUp className="w-5 h-5" />
            Key Insights
          </h4>
          <div className="space-y-2 text-sm text-blue-700">
            {parseFloat(analytics.averageRating) >= 4.5 && (
              <p>• Excellent customer satisfaction with consistently high ratings</p>
            )}
            {parseInt(analytics.recommendationRate) >= 90 && (
              <p>• Outstanding recommendation rate - customers love this product</p>
            )}
            {parseInt(analytics.verifiedPurchaseRate) >= 70 && (
              <p>• High percentage of verified purchases adds credibility</p>
            )}
            {analytics.recentTrend === 'improving' && (
              <p>• Recent reviews show improving customer satisfaction</p>
            )}
            {analytics.ratingDistribution[5] > analytics.totalReviews * 0.6 && (
              <p>• Majority of customers give 5-star ratings</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewAnalytics;
