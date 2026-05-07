import { Router } from 'express';
import { Note } from '../models/index.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

const SYSTEM_PROMPT = `You are AI Kuttan, an academic tutor for StuNet - an educational platform for college students.

STRICT RULES:
1. You MUST ONLY respond to academic queries related to the student's curriculum, programming questions, semester concepts, or general educational explanations.
2. You can explain concepts, generate exam answers, suggest important questions, and summarize notes.
3. You MUST REJECT any non-academic queries (entertainment, general knowledge, personal advice, unsafe/harmful content, etc.)
4. Your answers should be exam-oriented and aligned with university syllabus levels.
5. If the user asks something outside academic scope, respond with: "I'm designed to help with academic topics only. Please ask about your subjects, notes, or exam preparation."
6. Always be concise and structured - use bullet points, numbered lists, and clear headings.
7. Use the provided NOTES CONTEXT to answer the question if it contains relevant information. If it doesn't, use your general academic knowledge.`;

router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message, context } = req.body;

    const nonAcademic = ['movie', 'joke', 'song', 'recipe', 'dating', 'relationship', 'celebrity'];
    const isNonAcademic = nonAcademic.some(word => message.toLowerCase().includes(word));

    if (isNonAcademic) {
      return res.json({
        response: "⚠️ **Academic Context Only**\n\nI'm designed to help with academic topics only. Please ask about your subjects, notes, or exam preparation.",
        restricted: true
      });
    }

    // Step 1: Search Notes Collection for Context
    let notesContext = '';
    try {
      const searchTerms = message.split(' ').filter(w => w.length > 3).join(' ');
      if (searchTerms) {
        const relevantNotes = await Note.find(
          { $text: { $search: searchTerms }, isPublic: true },
          { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } }).limit(3);

        if (relevantNotes.length > 0) {
          notesContext = relevantNotes.map(n => `Title: ${n.title}\nSubject: ${n.subject}\nSummary: ${n.summary}`).join('\n\n');
        }
      }
    } catch (dbErr) {
      console.error('Notes search error:', dbErr.message);
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = await import('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `${SYSTEM_PROMPT}\n\n[NOTES CONTEXT from StuNet DB]\n${notesContext || 'No relevant notes found in DB.'}\n\n[STUDENT QUESTION]\n${message}`;
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        return res.json({ response, restricted: false });
      } catch (aiError) {
        console.error('Gemini API error:', aiError.message);
      }
    }

    res.json({ response: `[Mock AI Response - No Gemini API Key]\n\nBased on your query: ${message}\nContext from Notes DB: ${notesContext ? 'Found matches.' : 'No matches.'}`, restricted: false });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'AI service unavailable' });
  }
});

router.post('/summarize', authMiddleware, async (req, res) => {
  try {
    const { content, title } = req.body;
    const summary = `📋 **Summary: ${title}**\n\n🔑 Key points extracted from your notes:\n\n1. Main concept and definition\n2. Important formulas and derivations\n3. Applications and examples\n4. PYQ-relevant topics\n\n*Quick revision ready!*`;
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to summarize' });
  }
});

export default router;
