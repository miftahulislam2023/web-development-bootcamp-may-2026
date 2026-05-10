import { auth } from "../../config/firebase/firebase.js";

export const verifyFirebaseToken=async(req,res,next)=>{
    try {
        const authorization=req.headers.authorization;
        
        if(!authorization || !authorization.startsWith("Bearer"))
            return res.status(401).send({
                success:false,
                message:"Unauthorized access"
            });

        const token=authorization.split(" ")[1];

        if(!token)
            return res.status(401).send({
                success:false,
                message:"Unauthorized access"
            });

        req.user=await auth.verifyIdToken(token);
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Invalid or expired token"
        });
    }
};