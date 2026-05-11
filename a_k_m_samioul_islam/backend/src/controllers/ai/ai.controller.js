import { recommendationService } from "../../services/ai/ai.service.js"

export const getRecommendation=async(req,res)=>{
    try{
        const recommendation=await recommendationService(req.dbUser);

        return res.status(200).json({
            success: true,
            message: "Recommendation fetched successfully",
            data: recommendation
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};