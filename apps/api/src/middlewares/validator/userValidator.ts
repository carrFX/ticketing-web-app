import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const ValidateRegister = [
    body('username').notEmpty().withMessage('name is required!'),
    body('email').notEmpty().withMessage('email is required!').isEmail().withMessage('invalid email!'),
    body('password').notEmpty().withMessage('password is required!').isLength({min:5}).withMessage('password must be at least 5 characters!'),
    body('role').notEmpty().withMessage('role is required').isIn(['seller','buyer']).withMessage('role must be seller or buyer'),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).send({
                status : "error",
                message : errors.array()
            })
        }

        next()
    }
]