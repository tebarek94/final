import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ 
      error: 'Validation failed', 
      details: errors.array() 
    });
    return;
  }
  next();
};

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  handleValidationErrors
];

export const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('first_name').trim().isLength({ min: 2 }),
  body('last_name').trim().isLength({ min: 2 }),
  body('age').optional().isInt({ min: 1, max: 120 }),
  body('weight').optional().isFloat({ min: 0 }),
  body('height').optional().isFloat({ min: 0 }),
  handleValidationErrors
];

export const validateRecipe = [
  body('title').trim().isLength({ min: 3, max: 255 }),
  body('ingredients').isArray({ min: 1 }),
  body('instructions').isArray({ min: 1 }),
  body('cooking_time').optional().isInt({ min: 1 }),
  body('servings').optional().isInt({ min: 1 }),
  handleValidationErrors
];

export const validateMealPlan = [
  body('name').trim().isLength({ min: 3, max: 255 }),
  body('start_date').isISO8601(),
  body('end_date').isISO8601(),
  body('meals').isArray({ min: 1 }),
  handleValidationErrors
];
