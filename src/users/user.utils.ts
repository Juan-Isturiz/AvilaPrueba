import { JwtPayload, Secret, sign, verify } from "jsonwebtoken"
import { User } from "./user.services"
import { NextFunction, Request, Response } from "express"
import { hash } from "bcrypt";

const TOKEN_SECRET = process.env.TOKEN_SECRET as string

interface AuthRequest extends Request {
    token: string | JwtPayload;
}
export type NewUserInput = {
    email: string;
    name: string;
    role: string;
    password: string;
}
export type EditUserInput = {
    email?: string;
    name?: string;
    role?: string;
    password?: string;
}

export const generateAcessToken = (user: User) => {
    return sign(
        {
            role: user.role,
            user: user
        },
        TOKEN_SECRET,
        {
            expiresIn: '3600s'
        }
    )
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) {
            throw new Error();
        }
        const decoded = verify(token, TOKEN_SECRET);
        (req as AuthRequest).token = decoded;
        next()
    } catch (error) {
        res.status(401).json('Error while authenticating')
    }
}

export const passwordHashing = async (password: string) => {
    const hashedPassword = await hash(password, 10)
    return hashedPassword
}