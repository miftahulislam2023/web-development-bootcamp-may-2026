import { createUserService, getUserDetailsService, updateUserDetailsService } from "../../services/user/user.service.js";

// User creation 

export const createUser = async (req, res) => {
    try {
        const user = await createUserService(req.body);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// User details fetch

export const getUserDetails=async(req,res)=>{
    try {
        const user=await getUserDetailsService(req.params.email);

        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: user
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// User details update

export const updateUserDetails=async(req,res)=>{
    try {
        const updatedUser=await updateUserDetailsService(req.body);

        return res.status(200).json({
            success: true,
            message: "User details updated successfully",
            data: updatedUser
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

