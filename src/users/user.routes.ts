import express from "express";
import type { Request, Response } from "express";
import * as UserService from "./user.services"
import { body, validationResult } from 'express-validator';
import { generateAcessToken } from "./user.utils";

export const userRouter = express.Router();

userRouter.post('/auth', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const logInResponse = await UserService.logIn(email, password);
        return res.status(200).json(logInResponse)
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})

userRouter.post('/sign-up',
    body("email").isString(),
    body("name").isString(),
    body("role").isString(),
    body("password").isString(),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const input = req.body
            const newUser = UserService.signUp(input);
            res.status(200).json(newUser);
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }
)