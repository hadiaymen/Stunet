import { Router } from 'express';
import { Note } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '../uploads');

const router = Router();

// GET /api/notes - List notes with filters (PUBLIC)
router.get('/', async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    try {
      const { semester, subject, module: mod, search } = req.query;
      const filter = { isPublic: true };
      if (semester) filter.semester = parseInt(semester);
      if (subject) filter.subject = subject;
      if (mod) filter.module = mod;
      if (search) {
        filter.$text = { $search: search };
      }

      const notes = await Note.find(filter)
        .populate('ownerId', 'name')
        .sort({ updatedAt: -1 })
        .limit(50);

      res.json(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      // Fallback to mock data
      generateMockNotes(req, res);
    }
  } else {
    // DB not connected, use mock
    generateMockNotes(req, res);
  }
});

function generateMockNotes(req, res) {
  try {
    const mockNotes = [];
    const subjects = fs.readdirSync(UPLOADS_DIR).filter(f => fs.statSync(path.join(UPLOADS_DIR, f)).isDirectory());
    let id = 1;
    for (const subj of subjects) {
      const subjPath = path.join(UPLOADS_DIR, subj);
      const files = fs.readdirSync(subjPath).filter(f => f.endsWith('.pdf'));
      for (const file of files) {
        const title = path.parse(file).name.replace(/[-_]/g, ' ');
        const type = subj === 'PYQ' || title.toLowerCase().includes('pyq') ? 'pyq' : 'note';
        let subject = subj;
        if (subj === 'PYQ') {
          // Determine subject from title
          const titleLower = title.toLowerCase();
          if (titleLower.includes('chemistry') || titleLower.includes('engineering chemistry')) subject = 'Chemistry';
          else if (titleLower.includes('physics') || titleLower.includes('thermodynamics') || titleLower.includes('quantum')) subject = 'Physics';
          else if (titleLower.includes('math') || titleLower.includes('linear algebra') || titleLower.includes('transform')) subject = 'Mathematics';
          else if (titleLower.includes('computer') || titleLower.includes('distributed') || titleLower.includes('operating') || titleLower.includes('database') || titleLower.includes('networks')) subject = 'Computer Science';
          else if (titleLower.includes('oops') || titleLower.includes('object oriented')) subject = 'OOPS';
          else if (titleLower.includes('cps') || titleLower.includes('cyber physical')) subject = 'CPS';
          else if (titleLower.includes('de') || titleLower.includes('digital electronics')) subject = 'DE';
          else if (titleLower.includes('evs') || titleLower.includes('environmental')) subject = 'EVS';
          else if (titleLower.includes('lat') || titleLower.includes('linear algebra')) subject = 'LAT';
          else subject = 'General';
        }
        mockNotes.push({
          _id: `mock_${id++}`,
          title,
          subject,
          module: subj === 'PYQ' ? 'Previous Year Questions' : 'General',
          semester: 2,
          fileUrl: `/uploads/${subj}/${file}`,
          summary: `${type === 'pyq' ? 'PYQ' : 'Notes'} for ${subject} - ${title}`,
          keywords: [subject.toLowerCase(), 's2', 'engineering'],
          type,
          ownerId: { name: 'StuNet System' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      // Also check subdirs
      const subdirs = fs.readdirSync(subjPath).filter(f => fs.statSync(path.join(subjPath, f)).isDirectory());
      for (const sub of subdirs) {
        const subPath = path.join(subjPath, sub);
        const subFiles = fs.readdirSync(subPath).filter(f => f.endsWith('.pdf'));
        for (const file of subFiles) {
          const title = path.parse(file).name.replace(/[-_]/g, ' ');
          const type = sub === 'PYQ' || subj === 'PYQ' || title.toLowerCase().includes('pyq') ? 'pyq' : 'note';
          mockNotes.push({
            _id: `mock_${id++}`,
            title,
            subject: subj,
            module: sub,
            semester: 2,
            fileUrl: `/uploads/${subj}/${sub}/${file}`,
            summary: `${type === 'pyq' ? 'PYQ' : 'Notes'} for ${subj} module ${sub} - ${title}`,
            keywords: [subj.toLowerCase(), sub.toLowerCase(), 's2', 'engineering'],
            type,
            ownerId: { name: 'StuNet System' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }
    }
    // Filter based on query
    let filtered = mockNotes;
    if (req.query.subject) filtered = filtered.filter(n => n.subject === req.query.subject);
    if (req.query.module) filtered = filtered.filter(n => n.module === req.query.module);
    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      filtered = filtered.filter(n => n.title.toLowerCase().includes(search) || n.summary.toLowerCase().includes(search));
    }
    // Sort by subject, then module, then title
    filtered.sort((a, b) => {
      if (a.subject !== b.subject) return a.subject.localeCompare(b.subject);
      if (a.module !== b.module) return a.module.localeCompare(b.module);
      return a.title.localeCompare(b.title);
    });
    res.json(filtered.slice(0, 50));
  } catch (mockError) {
    console.error('Mock data error:', mockError);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
}

// GET /api/notes/:id - Get a single note (PUBLIC)
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('ownerId', 'name');
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// POST /api/notes - Create a note (Protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, fileUrl, semester, subject, module: mod, summary, keywords } = req.body;
    const note = await Note.create({
      title, fileUrl, semester, subject, module: mod,
      summary, keywords,
      ownerId: req.userId,
      isPublic: true
    });
    res.status(201).json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

export default router;
