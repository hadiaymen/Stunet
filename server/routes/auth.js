import { Router } from 'express';
import { User } from '../models/index.js';
import { generateToken } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/login
// Simplified login/register based on the final DB schema (no password)
router.post('/login', async (req, res) => {
  try {
    const { mobileNumber, name } = req.body;
    if (!mobileNumber) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    let user = await User.findOne({ mobileNumber });
    
    // If user doesn't exist, and name is provided, create it
    if (!user) {
      if (!name) {
        return res.status(400).json({ error: 'User not found. Provide name to register.' });
      }
      user = await User.create({ mobileNumber, name, friends: [] });
    }

    const token = generateToken(user._id);
    res.json({ success: true, token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default router;
