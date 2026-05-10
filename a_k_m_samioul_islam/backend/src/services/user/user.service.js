import { User } from "../../models/user/user.model.js";

// User creation service

export const createUserService = async (userData) => {
    const { name, email, currency } = userData;

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

// User details service

export const getUserDetailsService=async(email)=>{
    const user=await User.findOne({email});

    if(!user){
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};
