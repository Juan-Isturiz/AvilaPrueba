import express from "express";
import type { Request, Response } from "express";
import * as UserService from "./user.services"
import { body, validationResult } from 'express-validator';
import { authenticateToken, generateAcessToken } from "./user.utils";
import { UserStatus } from "../utils/util.types";

export const userRouter = express.Router();

userRouter.post('/auth',
    body("email").isEmail(),
    body("password").isString(),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { email, password } = req.body;
            const logInResponse = await UserService.logIn(email, password);
            return res.status(200).json(logInResponse)
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    })

userRouter.post('/sign-up',
    body("email").isEmail(),
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

userRouter.put('/:id',
    authenticateToken,
    async (req: Request, res: Response) => {
        try {
            const id: number = parseInt(req.params.id, 10);
            const input = req.body
            const updatedUser = await UserService.updateUser(id, input);
            return res.status(200).json(updatedUser);
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    },
)
userRouter.put('/suspend/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10)
        const updatedUser = await UserService.changeUserStatus(id, UserStatus.SUSPENDED)
        return res.status(200).json(updatedUser);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})
userRouter.put('/active/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10)
        const updatedUser = await UserService.changeUserStatus(id, UserStatus.ACTIVE)
        return res.status(200).json(updatedUser);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})
userRouter.put('/delete/:id', authenticateToken, async (req: Request, res: Response) => {
    try {
        const id: number = parseInt(req.params.id, 10)
        const updatedUser = await UserService.changeUserStatus(id, UserStatus.DELETED)
        return res.status(200).json(updatedUser);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
})