import { createUserService, getUserDetailsService } from "../../services/user/user.service.js";

// User creation 

export const createUser = async (req, res) => {
    try {
        const user = await createUserService(req.body);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// User details

export const getUserDetails=async(req,res)=>{
    try {
        const user=await getUserDetailsService(req.params.email);

        return res.status(200).json({
            success: true,
            message: "User details received successfully",
            data: user
        })
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};


