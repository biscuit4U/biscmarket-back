import { body } from 'express-validator';

// For OTP password change
export const validateOTPandEmail = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email')
        .toLowerCase(),
    body('otp').isLength({ min: 6, max: 6 }).isNumeric(),
];

// For authenticated password change
export const validateAuthenticatedPassword = [
    body('currentPassword').notEmpty(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .isLength({ max: 30 }).withMessage('Password cannot be longer than 30 characters')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one special character')
]

export const validateRequestPasswordChange = [
    body('email').trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email')
        .toLowerCase(),
]

export const validatePassword = [
    body('passwordChangeToken').notEmpty().withMessage('token is required'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .isLength({ max: 30 }).withMessage('Password cannot be longer than 30 characters')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain at least one special character')
]
