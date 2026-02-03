// src/routes/auth.routes.js
import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { register, login, me } from '../controllers/auth.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post(
  '/register',
  [
    body('name')
      .isString().withMessage('Name must be a string')
      .trim()
      .isLength({ min: 2 }).withMessage('Name required'),
    body('password')
      .isString().withMessage('Password must be a string')
      .isLength({ min: 6 }).withMessage('Min 6 chars password'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords must match'),
    body('age')
      .optional()
      .toInt()
      .isInt({ min: 10, max: 120 }).withMessage('Age must be between 10 and 120'),
    body('farmerType')
      .optional()
      .isString().withMessage('Farmer type must be a string')
      .notEmpty().withMessage('Farmer type required'),
    body('mobile')
      .optional()
      .isString().withMessage('Mobile must be a string')
      .notEmpty().withMessage('Mobile required'),
    body('location')
      .optional()
      .isString().withMessage('Location must be a string')
      .trim()
      .isLength({ max: 100 }).withMessage('Location max length is 100'),
    body('language')
      .optional()
      .isString().withMessage('Language must be a string')
      .notEmpty().withMessage('Language required'),
  ],
  validate,
  register
);

const phoneRegex = /^\+[1-9]\d{7,14}$/;

router.post(
  '/login',
  [
    body('mobile')
      .matches(phoneRegex)
      .withMessage('Mobile must be in E.164 format (e.g., +918328525095)'),
    body('password')
      .isString()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validate,
  login
);

router.get('/me', authRequired, me);
router.get('/test',()=>{
  console.log("test route");
}); // alias
//dinesh

export default router;

