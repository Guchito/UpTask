import e, { Router } from "express";
import { body } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middleware/validation";

const router = Router();

router.post('/create-account', 
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('email')
        .isEmail().withMessage('Email is invalid'),
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('password_confirmation')
        .custom((value, { req }) => {
            if( value.length < 8){
                throw new Error('Password confirmation must be at least 8 characters long');
            }else if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account', 
    body('token')
        .notEmpty().withMessage('Token is required'),
    handleInputErrors,
    AuthController.confirmAccount
)

export default router