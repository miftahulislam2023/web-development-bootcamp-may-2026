import { createUserService } from "../../services/user/user.service.js";

export const createUser = async (req, res) => {
    try {
        const user = await createUserService(req.body);

        res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};
