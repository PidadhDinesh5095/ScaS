import FertilizerPlan from '../models/FertilizerPlan.js';
import { getFertilizerPlan } from '../services/gemini.js';
import User from '../models/User.js';
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
  
  
};

export async function fertilizerPlan(req, res) {
  try {
    const { crop, stage } = req.body;
    const user = await User.findById(req.user._id);
    if (!crop || !stage) {
      return res.status(400).json({ error: "Crop and growth stage are required." });
    }
    const languageCode = user.preferences.language;
    const language = languageNativeNames[languageCode] || languageCode;
    // Call Gemini service to get the plan
    const plan = await getFertilizerPlan({ crop, stage, language });

    // Store in DB
    const doc = await FertilizerPlan.create({
      userId: req.user.id,
      crop,
      stage,
      plan
    });

    return res.status(201).json(plan);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
