import jwt from 'jsonwebtoken';
import { ENV } from './env.js';


export const generateToken= (userId, res)=>{
    const {JWT_SECRET} = ENV;
    if(!JWT_SECRET){
        throw new Error("JWT_SECRECT is not configured");
    }
    const token= jwt.sign({userId}, ENV.JWT_SECRET,{
        expiresIn: "7d",
    });

    res.cookie("jwt",token,{
        maxAge: 7*24*60*60*1000, // mili sec
        httpOnly: true, // prevent xss attacks
        sameSite: "strict", // CSRF attactk
        secure: ENV.NODE_ENV==='development'? false: true,
    });
    return token;
};
