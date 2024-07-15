import { createUser, findUserByUsername } from './database.server';
import bcrypt from "bcryptjs";

export const registerUser = async (username: string, password: string) => {
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
        throw new Error('Username already exists');
    }
    return await createUser(username, password);
};

export async function loginUser(username: string, password: string): Promise<{ id: number; username: string; }> {
    const user = await findUserByUsername(username);
    if (!user || await bcrypt.compare(password, user.password)) {
        throw new Error('Invalid username or password');
    }
    return user;
}
