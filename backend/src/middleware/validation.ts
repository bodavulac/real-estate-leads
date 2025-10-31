import { body } from 'express-validator';

export const validateCreateLead = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),

  body('investmentType')
    .notEmpty()
    .withMessage('Investment type is required')
    .isIn(['Plot', 'Villa', 'Apartment', 'Commercial'])
    .withMessage('Investment type must be one of: Plot, Villa, Apartment, Commercial'),

  body('budget')
    .trim()
    .notEmpty()
    .withMessage('Budget is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Budget must be between 1 and 50 characters'),

  body('timeline')
    .trim()
    .notEmpty()
    .withMessage('Timeline is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Timeline must be between 1 and 100 characters')
];

export const validateUpdateLead = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),

  body('investmentType')
    .optional()
    .isIn(['Plot', 'Villa', 'Apartment', 'Commercial'])
    .withMessage('Investment type must be one of: Plot, Villa, Apartment, Commercial'),

  body('budget')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Budget must be between 1 and 50 characters'),

  body('timeline')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Timeline must be between 1 and 100 characters')
];