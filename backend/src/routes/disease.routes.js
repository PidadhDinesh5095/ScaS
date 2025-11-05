// src/routes/disease.routes.js
import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { diagnose, list } from '../controllers/disease.controller.js';
import multer from 'multer';
import{fertilizerPlan}from'../controllers/fertilizer.controller.js';

const router = Router();
const upload = multer();

router.post(
  '/diagnose',
  authRequired,
  upload.single("file"),
  (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
      'image/bmp',
      'image/gif'
    ];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Only image files are allowed' });
    }

    console.log("Uploaded file:", req.file.originalname, req.file.mimetype, req.file.size);
    next();
  },
  diagnose
);

router.get('/', authRequired, list);

router.post(
  '/plan',
  authRequired,
  (req, res, next) => {
    const { crop, stage } = req.body;
    if (!crop || !stage) {
      return res.status(400).json({ error: 'Both crop and stage are required' });
    }
    next();
  },
  fertilizerPlan
);

export default router;
    
