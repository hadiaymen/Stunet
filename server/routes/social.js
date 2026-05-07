import { Router } from 'express';
import { User, Message } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/friends', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends', 'name mobileNumber');
    res.json(user?.friends || []);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

// "Friend request" directly adds them as friends for the demo since FriendRequest schema was dropped
router.post('/friend-request', authMiddleware, async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    const target = await User.findOne({ mobileNumber });
    if (!target) return res.status(404).json({ error: 'User not found' });
    
    // Add to each other's friends list
    await User.findByIdAndUpdate(req.userId, { $addToSet: { friends: target._id } });
    await User.findByIdAndUpdate(target._id, { $addToSet: { friends: req.userId } });
    
    res.status(201).json({ success: true, message: 'Friend added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add friend' });
  }
});

router.get('/messages/:friendId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.userId, receiverId: req.params.friendId },
        { senderId: req.params.friendId, receiverId: req.userId }
      ]
    }).sort({ createdAt: 1 }).limit(100);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
