import jwt from "jsonwebtoken"
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET!;

export const generateToken = (user:any) =>
{
    return jwt.sign({user}, JWT_SECRET, {expiresIn: "15d"});
};