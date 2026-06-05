import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRole } from "../types/user.js";
import { createUser, findUserByEmail } from "./user.js";
import error from "../utils/error.js";
import { getRandomColor } from "../utils/colors.js";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";

export type RegisterInput = {
    name: string;
    email: string;
    password: string;
}

export type LoginInput = {
    email: string;
    password: string;
}

export const registerUser = async (name: string, email: string, password: string) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await createUser({
        name: name,
        email: email,
        password: hashedPassword,
        role: UserRole.user,
        color: getRandomColor(),
    });

    return newUser;
};

export const loginUser = async (email: string, password: string) => {

    const user = await findUserByEmail(email);
    if (!user) {
        throw error("Invalid credentials", 404);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw error("Invalid credentials", 401);
    }

    const userInfo = { id: user.id, name: user.name, email: user.email, role: user.role, color: user.color }
    const token = jwt.sign(
        userInfo,
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { token, user: userInfo }
};