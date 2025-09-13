import express from 'express';
const router = express.Router();

// In-memory storage for loyalty program data
let loyaltyMembers = new Map();
let loyaltyTiers = [
  {
    id: 'bronze',
    name: 'Bronze',
    minPoints: 0,
    benefits: [
      'Earn 1 point per $1 spent',
      'Birthday discount: 10%',
      'Free shipping on orders over $50'
    ],
    color: '#CD7F32',
    icon: '🥉'
  },
  {
    id: 'silver',
    name: 'Silver',
    minPoints: 500,
    benefits: [
      'Earn 1.5 points per $1 spent',
      'Birthday discount: 15%',
      'Free shipping on orders over $35',
      'Early access to new products'
    ],
    color: '#C0C0C0',
    icon: '🥈'
  },
  {
    id: 'gold',
    name: 'Gold',
    minPoints: 1500,
    benefits: [
      'Earn 2 points per $1 spent',
      'Birthday discount: 20%',
      'Free shipping on all orders',
      'Early access to new products',
      'Exclusive member-only products'
    ],
    color: '#FFD700',
    icon: '🥇'
  },
  {
    id: 'platinum',
    name: 'Platinum',
    minPoints: 3000,
    benefits: [
      'Earn 2.5 points per $1 spent',
      'Birthday discount: 25%',
      'Free shipping on all orders',
      'Priority customer support',
      'Early access to new products',
      'Exclusive member-only products',
      'Personal shopping assistance'
    ],
    color: '#E5E4E2',
    icon: '💎'
  }
];

let rewardCatalog = [
  {
    id: 'discount-5',
    name: '$5 Off Your Next Order',
    description: 'Get $5 off any order of $25 or more',
    pointsCost: 100,
    type: 'discount',
    value: 5,
    minOrderValue: 25,
    expiryDays: 30,
    category: 'discount'
  },
  {
    id: 'discount-10',
    name: '$10 Off Your Next Order',
    description: 'Get $10 off any order of $50 or more',
    pointsCost: 200,
    type: 'discount',
    value: 10,
    minOrderValue: 50,
    expiryDays: 30,
    category: 'discount'
  },
  {
    id: 'discount-25',
    name: '$25 Off Your Next Order',
    description: 'Get $25 off any order of $100 or more',
    pointsCost: 500,
    type: 'discount',
    value: 25,
    minOrderValue: 100,
    expiryDays: 30,
    category: 'discount'
  },
  {
    id: 'free-shipping',
    name: 'Free Shipping',
    description: 'Free shipping on your next order (any amount)',
    pointsCost: 75,
    type: 'shipping',
    value: 0,
    minOrderValue: 0,
    expiryDays: 60,
    category: 'shipping'
  },
  {
    id: 'custom-card',
    name: 'Free Custom Greeting Card',
    description: 'Get a personalized greeting card for free',
    pointsCost: 300,
    type: 'product',
    value: 15.99,
    minOrderValue: 0,
    expiryDays: 90,
    category: 'product'
  },
  {
    id: 'priority-support',
    name: '30 Days Priority Support',
    description: 'Get priority customer support for 30 days',
    pointsCost: 150,
    type: 'service',
    value: 0,
    minOrderValue: 0,
    expiryDays: 30,
    category: 'service'
  }
];

// Helper functions
const getUserTier = (points) => {
  return loyaltyTiers
    .slice()
    .reverse()
    .find(tier => points >= tier.minPoints) || loyaltyTiers[0];
};

const calculatePointsEarned = (orderAmount, tier) => {
  const multipliers = {
    bronze: 1,
    silver: 1.5,
    gold: 2,
    platinum: 2.5
  };
  return Math.floor(orderAmount * (multipliers[tier.id] || 1));
};

const generateRewardCode = () => {
  return 'REWARD' + Math.random().toString(36).substr(2, 8).toUpperCase();
};

// Get user loyalty profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    let member = loyaltyMembers.get(userId);
    
    if (!member) {
      // Create new member
      member = {
        userId,
        points: 0,
        totalPointsEarned: 0,
        totalSpent: 0,
        joinDate: new Date(),
        tier: loyaltyTiers[0],
        pointsHistory: [],
        redeemedRewards: [],
        availableRewards: []
      };
      loyaltyMembers.set(userId, member);
    }
    
    // Update tier based on current points
    member.tier = getUserTier(member.points);
    
    // Calculate points needed for next tier
    const currentTierIndex = loyaltyTiers.findIndex(t => t.id === member.tier.id);
    const nextTier = loyaltyTiers[currentTierIndex + 1];
    const pointsToNextTier = nextTier ? nextTier.minPoints - member.points : 0;
    
    res.json({
      ...member,
      pointsToNextTier,
      nextTier,
      allTiers: loyaltyTiers
    });
    
  } catch (error) {
    console.error('Get loyalty profile error:', error);
    res.status(500).json({ 
      message: 'Failed to get loyalty profile',
      error: error.message 
    });
  }
});

// Add points for order
router.post('/add-points', async (req, res) => {
  try {
    const { userId, orderId, orderAmount, description } = req.body;
    
    if (!userId || !orderAmount) {
      return res.status(400).json({ message: 'User ID and order amount are required' });
    }
    
    let member = loyaltyMembers.get(userId) || {
      userId,
      points: 0,
      totalPointsEarned: 0,
      totalSpent: 0,
      joinDate: new Date(),
      tier: loyaltyTiers[0],
      pointsHistory: [],
      redeemedRewards: [],
      availableRewards: []
    };
    
    const currentTier = getUserTier(member.points);
    const pointsEarned = calculatePointsEarned(orderAmount, currentTier);
    
    // Update member data
    member.points += pointsEarned;
    member.totalPointsEarned += pointsEarned;
    member.totalSpent += orderAmount;
    member.tier = getUserTier(member.points);
    
    // Add to points history
    member.pointsHistory.unshift({
      id: Date.now().toString(),
      type: 'earned',
      points: pointsEarned,
      description: description || `Order #${orderId}`,
      date: new Date(),
      orderId
    });
    
    // Keep only last 50 history items
    if (member.pointsHistory.length > 50) {
      member.pointsHistory = member.pointsHistory.slice(0, 50);
    }
    
    loyaltyMembers.set(userId, member);
    
    // Check for tier upgrade
    const tierUpgrade = member.tier.id !== currentTier.id;
    
    res.json({
      pointsEarned,
      totalPoints: member.points,
      newTier: member.tier,
      tierUpgrade,
      message: `You earned ${pointsEarned} points!${tierUpgrade ? ` Congratulations! You've been upgraded to ${member.tier.name} tier!` : ''}`
    });
    
  } catch (error) {
    console.error('Add points error:', error);
    res.status(500).json({ 
      message: 'Failed to add points',
      error: error.message 
    });
  }
});

// Get reward catalog
router.get('/rewards', async (req, res) => {
  try {
    const { userId } = req.query;
    
    let userPoints = 0;
    if (userId) {
      const member = loyaltyMembers.get(userId);
      userPoints = member ? member.points : 0;
    }
    
    const catalogWithAvailability = rewardCatalog.map(reward => ({
      ...reward,
      canAfford: userPoints >= reward.pointsCost,
      userPoints
    }));
    
    res.json({
      rewards: catalogWithAvailability,
      userPoints
    });
    
  } catch (error) {
    console.error('Get rewards error:', error);
    res.status(500).json({ 
      message: 'Failed to get rewards',
      error: error.message 
    });
  }
});

// Redeem reward
router.post('/redeem', async (req, res) => {
  try {
    const { userId, rewardId } = req.body;
    
    if (!userId || !rewardId) {
      return res.status(400).json({ message: 'User ID and reward ID are required' });
    }
    
    const member = loyaltyMembers.get(userId);
    if (!member) {
      return res.status(404).json({ message: 'Loyalty member not found' });
    }
    
    const reward = rewardCatalog.find(r => r.id === rewardId);
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found' });
    }
    
    if (member.points < reward.pointsCost) {
      return res.status(400).json({ message: 'Insufficient points' });
    }
    
    // Deduct points
    member.points -= reward.pointsCost;
    
    // Generate reward code
    const rewardCode = generateRewardCode();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + reward.expiryDays);
    
    // Add to redeemed rewards
    const redeemedReward = {
      id: Date.now().toString(),
      rewardId: reward.id,
      name: reward.name,
      description: reward.description,
      code: rewardCode,
      pointsSpent: reward.pointsCost,
      redeemedDate: new Date(),
      expiryDate,
      used: false,
      type: reward.type,
      value: reward.value,
      minOrderValue: reward.minOrderValue
    };
    
    member.redeemedRewards.unshift(redeemedReward);
    
    // Add to points history
    member.pointsHistory.unshift({
      id: Date.now().toString(),
      type: 'redeemed',
      points: -reward.pointsCost,
      description: `Redeemed: ${reward.name}`,
      date: new Date(),
      rewardCode
    });
    
    loyaltyMembers.set(userId, member);
    
    res.json({
      success: true,
      reward: redeemedReward,
      remainingPoints: member.points,
      message: `Successfully redeemed ${reward.name}! Your reward code is: ${rewardCode}`
    });
    
  } catch (error) {
    console.error('Redeem reward error:', error);
    res.status(500).json({ 
      message: 'Failed to redeem reward',
      error: error.message 
    });
  }
});

// Get points history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const member = loyaltyMembers.get(userId);
    if (!member) {
      return res.json({ history: [], pagination: { totalPages: 0, currentPage: 1 } });
    }
    
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedHistory = member.pointsHistory.slice(startIndex, endIndex);
    
    const totalPages = Math.ceil(member.pointsHistory.length / parseInt(limit));
    
    res.json({
      history: paginatedHistory,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: member.pointsHistory.length,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
    
  } catch (error) {
    console.error('Get points history error:', error);
    res.status(500).json({ 
      message: 'Failed to get points history',
      error: error.message 
    });
  }
});

// Validate reward code
router.post('/validate-code', async (req, res) => {
  try {
    const { userId, code, orderAmount = 0 } = req.body;
    
    if (!userId || !code) {
      return res.status(400).json({ message: 'User ID and code are required' });
    }
    
    const member = loyaltyMembers.get(userId);
    if (!member) {
      return res.status(404).json({ message: 'Loyalty member not found' });
    }
    
    const reward = member.redeemedRewards.find(r => 
      r.code === code && !r.used && new Date() < new Date(r.expiryDate)
    );
    
    if (!reward) {
      return res.status(400).json({ message: 'Invalid or expired reward code' });
    }
    
    // Check minimum order value
    if (orderAmount < reward.minOrderValue) {
      return res.status(400).json({ 
        message: `Minimum order value of $${reward.minOrderValue} required for this reward` 
      });
    }
    
    res.json({
      valid: true,
      reward: {
        name: reward.name,
        description: reward.description,
        type: reward.type,
        value: reward.value,
        minOrderValue: reward.minOrderValue,
        expiryDate: reward.expiryDate
      }
    });
    
  } catch (error) {
    console.error('Validate reward code error:', error);
    res.status(500).json({ 
      message: 'Failed to validate reward code',
      error: error.message 
    });
  }
});

// Use reward code
router.post('/use-code', async (req, res) => {
  try {
    const { userId, code, orderId } = req.body;
    
    if (!userId || !code) {
      return res.status(400).json({ message: 'User ID and code are required' });
    }
    
    const member = loyaltyMembers.get(userId);
    if (!member) {
      return res.status(404).json({ message: 'Loyalty member not found' });
    }
    
    const rewardIndex = member.redeemedRewards.findIndex(r => 
      r.code === code && !r.used && new Date() < new Date(r.expiryDate)
    );
    
    if (rewardIndex === -1) {
      return res.status(400).json({ message: 'Invalid or expired reward code' });
    }
    
    // Mark reward as used
    member.redeemedRewards[rewardIndex].used = true;
    member.redeemedRewards[rewardIndex].usedDate = new Date();
    member.redeemedRewards[rewardIndex].orderId = orderId;
    
    loyaltyMembers.set(userId, member);
    
    res.json({
      success: true,
      message: 'Reward code successfully applied'
    });
    
  } catch (error) {
    console.error('Use reward code error:', error);
    res.status(500).json({ 
      message: 'Failed to use reward code',
      error: error.message 
    });
  }
});

// Get loyalty statistics
router.get('/stats', async (req, res) => {
  try {
    const totalMembers = loyaltyMembers.size;
    const tierDistribution = {};
    let totalPointsIssued = 0;
    let totalRewardsRedeemed = 0;
    
    loyaltyTiers.forEach(tier => {
      tierDistribution[tier.id] = 0;
    });
    
    loyaltyMembers.forEach(member => {
      tierDistribution[member.tier.id]++;
      totalPointsIssued += member.totalPointsEarned;
      totalRewardsRedeemed += member.redeemedRewards.length;
    });
    
    res.json({
      totalMembers,
      tierDistribution,
      totalPointsIssued,
      totalRewardsRedeemed,
      averagePointsPerMember: totalMembers > 0 ? Math.round(totalPointsIssued / totalMembers) : 0
    });
    
  } catch (error) {
    console.error('Get loyalty stats error:', error);
    res.status(500).json({ 
      message: 'Failed to get loyalty statistics',
      error: error.message 
    });
  }
});

export default router;
