import { UserStatus } from './../utils/util.types';
import { compareSync } from "bcrypt"; // Import password comparison function
import { db } from "../utils/db.server"; // Import database connection
import { EditUserInput, generateAcessToken, NewUserInput, passwordHashing } from "./user.utils"; // Import user-related utilities



export type User = {
    id: number;
    email: string;
    name: string;
    role: string;
};

/**
 * Logs in a user.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<{ user: User | Error, token: string }>} A Promise resolving to an object containing the user or an error, and a token.
 */
export const logIn = async (email: string, password: string): Promise<{ user: User | Error, token: string }> => {
    try {
        const user = await db.user.findUniqueOrThrow({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                password: true
            },
            where: { email: email }
        });

        if (!user) {
            throw new Error('User not found');
        }
        if ([UserStatus.SUSPENDED, UserStatus.DELETED].includes(user.status)) {
            throw new Error('User is account not authorized');
        }

        if (compareSync(password, user.password)) {
            const token = generateAcessToken(user);
            await db.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } })
            return { user, token };
        } else {
            throw new Error('Password mismatch');
        }
    } catch (error) {
        throw error;
    }
};

/**
 * Creates a new user.
 *
 * @param {NewUserInput} input - The user data to create.
 * @returns {Promise<User | Error>} A Promise resolving to the created user or an error.
 */
export const signUp = async (input: NewUserInput): Promise<User | Error> => {
    try {
        if (input.password.length < 8) throw new Error('Password must be at least 8 characters')

        input.password = await passwordHashing(input.password);

        const newUser = await db.user.create({
            data: input
        });

        return newUser;
    } catch (error) {
        throw error;
    }
};

/**
 * Updates a user.
 *
 * @param {number} id - The ID of the user to update.
 * @param {EditUserInput} data - The data to update the user with.
 * @returns {Promise<User | Error>} A Promise resolving to the updated user or an error.
 */
export const updateUser = async (id: number, data: EditUserInput) => {
    try {
        if (data.password) {
            if (data.password.length < 8) throw new Error(`Password must be at least 8 characters`);
            data.password = await passwordHashing(data.password);
        }
        if (data.email) {
            const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

            if (!emailRegex.test(data.email)) throw new Error("Invalid email format: " + data.email);
        }
        const updatedUser = await db.user.update({
            where: { id: id },
            data: data
        });
        return updatedUser;
    } catch (error) {
        throw error;
    }
};

/**
 * Changes the status of a user.
 *
 * @param {number} id - The ID of the user to update.
 * @param {UserStatus} status - The new status for the user.
 * @returns {Promise<User | Error>} A Promise resolving to the updated user or an error.
 */
export const changeUserStatus = async (id: number, status: UserStatus): Promise<User | Error> => {
    try {
        const updatedStatus = await db.user.update({
            data: {
                status: status
            },
            where: { id: id },
        })

        return updatedStatus;
    } catch (error) {
        throw error;
    }
}