import { Router } from 'express';
import { PYQ } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// GET /api/pyqs - List PYQs with filters
router.get('/', async (req, res) => {
  try {
    const { year, examType, subject, topic, difficulty } = req.query;
    const filter = {};
    if (year) filter.year = parseInt(year);
    if (examType) filter.examType = examType;
    if (subject) filter.subjectName = subject;
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const pyqs = await PYQ.find(filter)
      .sort({ year: -1, marks: -1 })
      .limit(100)
      .catch(() => []);

    res.json(pyqs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch PYQs' });
  }
});

// GET /api/pyqs/frequent - Get frequent questions analysis
router.get('/frequent', async (req, res) => {
  try {
    const frequent = await PYQ.aggregate([
      { $group: { _id: '$topic', count: { $sum: 1 }, subject: { $first: '$subjectName' }, years: { $addToSet: '$year' } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
      { $project: { topic: '$_id', subject: 1, frequency: '$count', years: 1, probability: { $multiply: [{ $divide: ['$count', 10] }, 100] } } }
    ]).catch(() => []);

    res.json(frequent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze PYQs' });
  }
});

// POST /api/pyqs - Add a PYQ
router.post('/', authMiddleware, async (req, res) => {
  try {
    const pyq = await PYQ.create(req.body);
    res.status(201).json(pyq);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create PYQ' });
  }
});

export default router;
