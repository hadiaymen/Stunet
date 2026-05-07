import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import * as pdfParseModule from 'pdf-parse';
const pdfParse = pdfParseModule.default || pdfParseModule;
import { Note, User } from '../models/index.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/StuNet';
const DATA_DIR = path.normalize('C:/Users/USER/Gitdemo/StuNet//S2/S2');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

async function extractTextFromPDF(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer, { max: 3 }); // Parse up to 3 pages to save time
    return data.text.substring(0, 1500); // Take first 1500 chars
  } catch (error) {
    console.error(`Failed to parse PDF ${pdfPath}:`, error.message);
    return '';
  }
}

async function generateMetadata(filename, textContent, subjectName) {
  // If Gemini API is available, we could use it, but for speed and reliability 
  // during batch import, we will generate structural metadata based on filename and text.
  
  const cleanName = path.parse(filename).name.replace(/[-_]/g, ' ');
  const title = cleanName;
  
  // Extract potential keywords from text content or fallback
  const fallbackKeywords = [subjectName.toLowerCase(), 'notes', 's2', 'engineering'];
  const extractedWords = textContent.split(/\s+/).filter(w => w.length > 5).slice(0, 10).map(w => w.toLowerCase());
  const keywords = [...new Set([...fallbackKeywords, ...extractedWords])].slice(0, 8);

  const summary = `Academic material for ${subjectName}. Covers topics related to ${title}. Automatically generated from semester resources.`;

  return { title, summary, keywords };
}

async function runImport() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing notes to prevent duplicates (optional, doing it for clean slate)
    await Note.deleteMany({});
    console.log('Cleared existing notes.');

    // Find or create System User
    let systemUser = await User.findOne({ mobileNumber: '0000000000' });
    if (!systemUser) {
      systemUser = await User.create({ name: 'StuNet System', mobileNumber: '0000000000', friends: [] });
    }

    if (!fs.existsSync(DATA_DIR)) {
      console.error('Data directory not found:', DATA_DIR);
      process.exit(1);
    }

    const subjects = fs.readdirSync(DATA_DIR).filter(f => fs.statSync(path.join(DATA_DIR, f)).isDirectory());

    for (const subject of subjects) {
      const subjectPath = path.join(DATA_DIR, subject);
      console.log(`Processing subject: ${subject}`);
      
      const modulesOrFiles = fs.readdirSync(subjectPath);

      for (const item of modulesOrFiles) {
        const itemPath = path.join(subjectPath, item);
        const stat = fs.statSync(itemPath);

        let filesToProcess = [];
        let moduleName = 'General';

        if (stat.isDirectory()) {
          moduleName = item;
          const subFiles = fs.readdirSync(itemPath).filter(f => f.endsWith('.pdf'));
          filesToProcess = subFiles.map(f => ({ path: path.join(itemPath, f), name: f }));
        } else if (item.endsWith('.pdf')) {
          filesToProcess = [{ path: itemPath, name: item }];
        }

        for (const file of filesToProcess) {
          console.log(`  Importing: ${file.name} to ${moduleName}`);
          
          // Copy to uploads
          const destName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const destPath = path.join(UPLOADS_DIR, destName);
          fs.copyFileSync(file.path, destPath);

          // Extract text
          const textContent = await extractTextFromPDF(destPath);
          
          // Generate Metadata
          const metadata = await generateMetadata(file.name, textContent, subject);

          // Insert Note
          await Note.create({
            ownerId: systemUser._id,
            semester: 2,
            subject: subject,
            module: moduleName,
            title: metadata.title,
            fileUrl: `/uploads/${destName}`,
            summary: metadata.summary,
            keywords: metadata.keywords,
            isPublic: true
          });
        }
      }
    }

    console.log('Data import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

runImport();
