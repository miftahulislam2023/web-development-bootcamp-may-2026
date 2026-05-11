import { getSummaryService } from "../../services/summary/summary.service.js";

// Dashboard summary fetch

export const getSummary=async(req,res)=>{
    try {
        const summary=await getSummaryService(dbUser);

        return res.status(200).json({
            success: true,
            message: "Summary fetched successfully",
            data:summary
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};