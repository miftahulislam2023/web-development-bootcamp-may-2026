const moment = require("moment");
const jwt = require("jsonwebtoken");

const checkAuthentication = (req, res, next) => {
    const authHeader= req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer"))
    {
        return res.status(401).json({
            message: "unauthorized",
            detail: "Missing or invalid Authorization header. Use: Bearer <token>",
        });
    }
    const token= authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "unauthorized", detail: "Token missing" });
    }
    try{
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        req.user= decoded;
        next();
    }
    catch(error)
    {
        return res.status(401).json({
            message: "unauthorized",
            detail: error.message || "Invalid or expired token",
        });
    }
}
module.exports= {checkAuthentication};