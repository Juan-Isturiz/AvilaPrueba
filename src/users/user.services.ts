import { compareSync } from "bcrypt"
import { db } from "../utils/db.server"
import { EditUserInput, generateAcessToken, NewUserInput, passwordHashing } from "./user.utils"

export type User = {
    id: number,
    email: string,
    name: string
    role: string
}

export const logIn = async (email: string, password: string): Promise<{ user: User | Error, token: string }> => {
    try {
        const user = await db.user.findUniqueOrThrow({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                password: true
            },
            where: { email: email }
        })
        if (!user) {
            throw new Error('User not found')
        }
        if (compareSync(password, user.password)) {

            const token = generateAcessToken(user)
            return { user, token }
        } else {
            throw new Error('Password mismatch')
        }

    } catch (error) {
        throw error;
    }
}

export const signUp = async (input: NewUserInput): Promise<User | Error> => {
    try {
        input.password = await passwordHashing(input.password)
        const newUser = await db.user.create({
            data: input
        })
        return newUser
    } catch (error) {
        throw error;
    }
}

export const updateUser = async (id: number, data: EditUserInput) => {
    try {
        const updatedUser = await db.user.update({
            where: { id: id },
            data: data
        })
        return updatedUser
    } catch (error) {
        throw error;
    }
}