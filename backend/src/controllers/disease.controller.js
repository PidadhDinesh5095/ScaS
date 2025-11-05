import DiseaseAnalysis from '../models/DiseaseAnalysis.js';
import { diagnoseDisease } from '../services/gemini.js';
import User from '../models/User.js';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const parsePDF = async (buffer) => {
  const data = new Uint8Array(buffer);
  const pdf = await getDocument({ data }).promise;

  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += `${pageText}\n`;
  }

  return fullText;
};

// Map of language codes to native names
const languageNativeNames = {
  en: "English",
  hi: "हिंदी",
  bn: "বাংলা",
  te: "తెలుగు",
  mr: "मराठी",
  ta: "தமிழ்",
  gu: "ગુજરાતી",
  kn: "ಕನ್ನಡ",
  ml: "മലയാളം",
  or: "ଓଡ଼ିଆ",
  pa: "ਪੰਜਾਬੀ",
 
  
  // ...add more as needed...
};

export async function diagnose(req, res) {
  try {
    const file = req.file;
    console.log("File received in diagnose:", file);
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let inputForGemini;
    let inputType;

    if (file.mimetype === 'application/pdf') {
      inputForGemini = await parsePDF(file.buffer);
      inputType = 'text';
    } else if (file.mimetype.startsWith('image/')) {
      inputForGemini = file.buffer.toString('base64');
      inputType = 'image';
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    // Convert language code to native name
    const languageCode = user.preferences.language;
    const language = languageNativeNames[languageCode] || languageCode;

    const result = await diagnoseDisease({
      input: inputForGemini,
      inputType,
      language,
    });

    const doc = await DiseaseAnalysis.create({
      userId: req.user.id,
      fileType: file.mimetype,
      diagnosis: result.diagnosis || {},
      language
    });

    return res.status(201).json(doc);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function list(req, res) {
  const docs = await DiseaseAnalysis.find({ userId: req.user.id }).sort({ createdAt: -1 });
  return res.json(docs);
}
