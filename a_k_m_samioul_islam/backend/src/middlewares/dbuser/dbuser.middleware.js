import { User } from "../../models/user/user.model.js"

export const loadDbUser=async(req,res,next)=>{
    try {
        const user=req.user;

        const dbUser=await User.findOne({
            email:user.email
        });

        if(!dbUser)
            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        req.dbUser=dbUser;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to load user"
        });
    }
}