import express from 'express';
const router = express.Router();

// In-memory storage for review votes (should be in database in production)
const reviewVotes = new Map();

// Vote on a review (helpful/not helpful)
router.post('/:reviewId/vote', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { voteType, userId } = req.body;
    
    if (!['helpful', 'not-helpful'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    const voteKey = `${reviewId}-${userId}`;
    
    // Check if user already voted on this review
    if (reviewVotes.has(voteKey)) {
      return res.status(400).json({ message: 'You have already voted on this review' });
    }

    // Store the vote
    reviewVotes.set(voteKey, voteType);
    
    res.json({ 
      message: 'Vote recorded successfully',
      voteType,
      reviewId
    });
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ message: 'Failed to record vote', error: error.message });
  }
});

// Get vote status for a user on a review
router.get('/:reviewId/vote/:userId', async (req, res) => {
  try {
    const { reviewId, userId } = req.params;
    const voteKey = `${reviewId}-${userId}`;
    
    const vote = reviewVotes.get(voteKey);
    
    res.json({ 
      hasVoted: !!vote,
      voteType: vote || null
    });
  } catch (error) {
    console.error('Error fetching vote status:', error);
    res.status(500).json({ message: 'Failed to fetch vote status', error: error.message });
  }
});

// Report a review
router.post('/:reviewId/report', async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { reason, userId } = req.body;
    
    // In production, this would store the report in database
    console.log(`Review ${reviewId} reported by ${userId} for: ${reason}`);
    
    res.json({ message: 'Review reported successfully' });
  } catch (error) {
    console.error('Error reporting review:', error);
    res.status(500).json({ message: 'Failed to report review', error: error.message });
  }
});

export default router;
