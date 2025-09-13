import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, Flag, Filter, SortAsc, SortDesc, MessageCircle, User, Calendar, Award, Verified } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import ReviewAnalytics from './ReviewAnalytics';

const ReviewsSection = ({ productId, reviews: initialReviews, onReviewAdded }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(initialReviews || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState({});
  
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    comment: '',
    wouldRecommend: true,
    verifiedPurchase: false
  });

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: SortDesc },
    { value: 'oldest', label: 'Oldest First', icon: SortAsc },
    { value: 'highest', label: 'Highest Rating', icon: Star },
    { value: 'lowest', label: 'Lowest Rating', icon: Star },
    { value: 'helpful', label: 'Most Helpful', icon: ThumbsUp }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Reviews' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '2', label: '2 Stars' },
    { value: '1', label: '1 Star' },
    { value: 'verified', label: 'Verified Purchases' },
    { value: 'recommended', label: 'Recommended' }
  ];

  useEffect(() => {
    if (initialReviews) {
      setReviews(initialReviews);
    }
  }, [initialReviews]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const reviewData = {
        ...newReview,
        productId,
        userName: user.name,
        userEmail: user.email,
        date: new Date().toISOString()
      };

      const { data } = await api.post(`/api/products/${productId}/reviews`, reviewData);
      
      setReviews(prev => [data, ...prev]);
      setNewReview({
        rating: 5,
        title: '',
        comment: '',
        wouldRecommend: true,
        verifiedPurchase: false
      });
      setShowReviewForm(false);
      
      if (onReviewAdded) {
        onReviewAdded(data);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleHelpfulVote = async (reviewId, isHelpful) => {
    if (!user) return;

    try {
      const voteType = isHelpful ? 'helpful' : 'not-helpful';
      await api.post(`/api/reviews/${reviewId}/vote`, { voteType, userId: user.email });
      
      setHelpfulVotes(prev => ({
        ...prev,
        [reviewId]: voteType
      }));

      // Update review helpful count locally
      setReviews(prev => prev.map(review => {
        if (review._id === reviewId) {
          return {
            ...review,
            helpfulCount: isHelpful 
              ? (review.helpfulCount || 0) + 1 
              : Math.max((review.helpfulCount || 0) - 1, 0)
          };
        }
        return review;
      }));
    } catch (error) {
      console.error('Failed to vote on review:', error);
    }
  };

  const getSortedAndFilteredReviews = () => {
    let filtered = [...reviews];

    // Apply filters
    if (filterBy !== 'all') {
      if (filterBy === 'verified') {
        filtered = filtered.filter(review => review.verifiedPurchase);
      } else if (filterBy === 'recommended') {
        filtered = filtered.filter(review => review.wouldRecommend);
      } else {
        filtered = filtered.filter(review => review.rating === parseInt(filterBy));
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onRatingChange && onRatingChange(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const ReviewForm = () => (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gray-50 p-6 rounded-lg mb-6"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Write a Review</h3>
      
      <form onSubmit={submitReview} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Rating *
          </label>
          {renderStars(newReview.rating, true, (rating) => 
            setNewReview(prev => ({ ...prev, rating }))
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Title *
          </label>
          <input
            type="text"
            value={newReview.title}
            onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent"
            placeholder="Summarize your experience"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review *
          </label>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent"
            placeholder="Tell others about your experience with this product"
            required
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newReview.wouldRecommend}
              onChange={(e) => setNewReview(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
              className="rounded border-gray-300 text-[var(--theme-pink)] focus:ring-[var(--theme-pink)]"
            />
            <span className="text-sm text-gray-700">I would recommend this product</span>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowReviewForm(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !newReview.title.trim() || !newReview.comment.trim()}
            className="px-6 py-2 bg-[var(--theme-pink)] text-gray-800 font-semibold rounded-lg hover:bg-[var(--theme-pink-hover)] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />}
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </motion.div>
  );

  const ReviewCard = ({ review }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--theme-pink)] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-800" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-800">{review.userName}</h4>
              {review.verifiedPurchase && (
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                  <Verified className="w-3 h-3" />
                  <span>Verified Purchase</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              {new Date(review.date).toLocaleDateString()}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {renderStars(review.rating)}
          {review.wouldRecommend && (
            <div className="flex items-center gap-1 text-green-600 text-sm">
              <Award className="w-4 h-4" />
              <span>Recommends</span>
            </div>
          )}
        </div>
      </div>

      <h5 className="font-semibold text-gray-800 mb-2">{review.title}</h5>
      <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleHelpfulVote(review._id, true)}
            disabled={!user || helpfulVotes[review._id]}
            className={`flex items-center gap-2 text-sm transition-colors ${
              helpfulVotes[review._id] === 'helpful'
                ? 'text-green-600'
                : 'text-gray-600 hover:text-green-600'
            } disabled:opacity-50`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>Helpful ({review.helpfulCount || 0})</span>
          </button>
          
          <button
            onClick={() => handleHelpfulVote(review._id, false)}
            disabled={!user || helpfulVotes[review._id]}
            className={`flex items-center gap-2 text-sm transition-colors ${
              helpfulVotes[review._id] === 'not-helpful'
                ? 'text-red-600'
                : 'text-gray-600 hover:text-red-600'
            } disabled:opacity-50`}
          >
            <ThumbsDown className="w-4 h-4" />
          </button>
        </div>

        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <Flag className="w-4 h-4" />
          <span>Report</span>
        </button>
      </div>
    </motion.div>
  );

  const filteredReviews = getSortedAndFilteredReviews();
  const averageRating = getAverageRating();
  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-6">
      {/* Enhanced Reviews Analytics */}
      <ReviewAnalytics reviews={reviews} />

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-gray-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--theme-pink)] focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {user && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--theme-pink)] text-gray-800 font-semibold rounded-lg hover:bg-[var(--theme-pink-hover)] transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Write a Review
          </button>
        )}
      </div>

      {error && (
        <ErrorMessage message={error} onRetry={() => setError('')} />
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showReviewForm && <ReviewForm />}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <LoadingSpinner text="Loading reviews..." />
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {filterBy === 'all' ? 'No reviews yet' : 'No reviews match your filter'}
            </h3>
            <p className="text-gray-500">
              {filterBy === 'all' 
                ? 'Be the first to share your experience!' 
                : 'Try adjusting your filter settings.'
              }
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
