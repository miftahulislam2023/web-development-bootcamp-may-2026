import { User } from "../../models/user/user.model.js";

// User creation service

export const createUserService = async (userData) => {
    const { name, email, currency, photoURL } = userData;

    if (!email || !name || !currency || !photoURL) {
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

// User details update service

export const updateUserDetailsService = async (userData, dbUser) => {
    const { name, currency, photoURL } = userData;

    const user = dbUser;

    if (!name && !photoURL && !currency) {
        const error = new Error("At least one field is required to update profile");
        error.statusCode = 400;
        throw error;
    }

    if (name) 
        user.name = name;

    if (currency) 
        user.currency = currency;

    if (photoURL) 
        user.photoURL = photoURL;

    await user.save();

    return user;
};
