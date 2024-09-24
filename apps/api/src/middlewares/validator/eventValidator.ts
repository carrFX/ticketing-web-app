import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const ValidateCreateEvent = [
    body('title').notEmpty().withMessage('name is required!'),
    body('description').notEmpty().withMessage('email is required!'),
    body('start_date').notEmpty().withMessage('start date is required!'),
    body('end_date').notEmpty().withMessage('end date is required'),
    body('location').notEmpty().withMessage('role is required'),

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