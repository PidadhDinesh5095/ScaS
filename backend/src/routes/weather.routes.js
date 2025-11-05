// src/routes/weather.routes.js
import { Router } from 'express';
import { query } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { current, advisory } from '../controllers/weather.controller.js';

const router = Router();

router.post(
  '/current',
  authRequired,
   [
    query('lat').isFloat({ min: -90, max: 90 }),
    query('lon').isFloat({ min: -180, max: 180 }),
    
  ],
   validate,
  current
);

router.get(
  '/advisory',
  authRequired,
  [
    query('lat').isFloat({ min: -90, max: 90 }),
    query('lon').isFloat({ min: -180, max: 180 }),
    query('crop').optional().isString(),
    query('language').optional().isString()
  ],
  validate,
  advisory
);

export default router;
