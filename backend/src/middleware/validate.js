// src/middleware/validate.js
import { validationResult } from 'express-validator';

export function validate(req, res, next) {
  const result = validationResult(req);
  console.log("Validation result:", result);
  if (!result.isEmpty()) {
    return res.status(400).json({ erors: result.array() });
  }
  console.log("Validation passed");
  next();
}
