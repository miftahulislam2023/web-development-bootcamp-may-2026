import axios from "axios";
import { getCurrentBudgetService } from "../budget/budget.service.js";
import { getSummaryService } from "../summary/summary.service.js"

export const recommendationService=async(dbUser)=>{
    const summary=await getSummaryService(dbUser);

    let currentBudget=null;

    try {
        currentBudget=await getCurrentBudgetService(dbUser);
    } catch (error) {
        if(error.statusCode!==404)
            throw error;
    }

    const aiInput={
        summary,
        currentBudget: currentBudget ? currentBudget : null
    };

    const prompt=`
        You are a personal finance advisor.
        Analyze the user's financial summary and current budget data.
        Give 3 to 5 short, practical and actionable recommendations.
        Keep the advice simple and helpful.
        Return only valid JSON.

        User data: ${JSON.stringify(aiInput,null,2)}

        Return format: {
            "insight": "short summary",
            "riskLevel": "low|medium|high",
            "recommendations": [
                "recommendation 1",
                "recommendation 2",
                "recommendation 3"
            ]
        }
    `;

    let response;

    try {
        response=await axios.post("https://openrouter.ai/api/v1/chat/completions",{
            model: process.env.OPENROUTER_MODEL,
            temperature: 0.3,
            messages:[
                {
                    role: "system",
                    content: "You are a helpful financial recommendation assistant"
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
            },
            {
                headers:{
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        const customError  = new Error(error.message);
        customError.statusCode = error.response?.status || 500;
        throw customError;
    }


    const data= response.data;

    const content=data.choices?.[0]?.message?.content;

    if(!content){
        const error=new Error("No recommendation from AI");
        error.statusCode=500;
        throw error;
    }

    let parsedRecommendation;

    try {
        parsedRecommendation=JSON.parse(content);
    } catch (error) {
        parsedRecommendation = {
            insight: "AI returned an unstructured response.",
            riskLevel: "medium",
            recommendations: [content]
        };
    }

    return {
        summary:aiInput.summary,
        currentBudget: aiInput.currentBudget,
        aiRecommendation: parsedRecommendation
    }
}