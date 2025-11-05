// src/controllers/weather.controller.js
import WeatherSnapshot from '../models/WeatherSnapshot.js';
import { getOneCall } from '../services/weather.js';
import { weatherAdvisory } from '../services/gemini.js';
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
  // ...add more as needed...
};

export async function current(req, res) {
  let language = "English";
  try {
    if (req.user && req.user._id) {
      const user = await User.findById(req.user._id);
      if (user && user.preferences && user.preferences.language) {
        const languageCode = user.preferences.language;
        language = languageNativeNames[languageCode] || languageCode;
      }
    }
  } catch (e) {
    // fallback to default language
    language = "English";
  }
  console.log("Determined language:", language);

  const lat = req.body.lat || req.query.lat;
  const lon = req.body.lng || req.body.lon || req.query.lon || req.query.lng;
  const units = req.query.units || 'metric';
  const exclude = req.query.exclude || 'minutely';

  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });

  console.log('Fetching weather for:', { lat, lon, units, exclude });
  let geminiAdvice = null;
  try {
    geminiAdvice = await weatherAdvisory({
      weatherJson: { lat, lon },
      language: language,
    });
  } catch (e) {
    geminiAdvice = null;
  }

  
  console.log('response from weatherAdvisory:', geminiAdvice);
  return res.json({
    
    geminiAdvice
  });
}

export async function advisory(req, res) {
  const { lat, lon, crop, language } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });
  const weather = await getOneCall({
    lat,
    lon,
    units: 'metric',
    exclude: 'minutely',
    apiKey: process.env.OPENWEATHER_API_KEY
  });
  const summary = await weatherAdvisory({ weatherJson: weather, crop, language });
  return res.json({ weather, advisory: summary.advisoryText });
}
