import { User } from "../../models/user/user.model.js";

export const createUser = async (userData) => {
    const { name, email, currency } = userData;

    if (!email || !name || !currency) {
        const error = new Error("All fields required");
        error.statusCode = 400;
        throw error;
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error("User already exists");
        error.statusCode = 409;
        throw error;
    }

    const user = await User.create(userData);

    return user;
};
