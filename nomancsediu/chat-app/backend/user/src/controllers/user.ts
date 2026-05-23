import type { Request, Response, NextFunction } from "express"
import TryCatch from "../config/TryCatch.js"
import { redisClient } from "../index.js"
import { publishToQueue } from "../config/rabitmq.js";
import { User } from "../model/User.js";
import { generateToken } from "../config/generateToken.js";
import type { AuthenticatedRequest } from "../middleware/isAuth.js";
import token from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

// OTP Generation 
export const loginUser = TryCatch(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body

  const rateLimitKey = `otp:ratelimit:${email}`
  const rateLimit = await redisClient.get(rateLimitKey)
  if(rateLimit)
  {
    res.status(429).json({
      success: false,
      message: "Too many requests. Please wait before requesting another OTP"
    });
    return;
  }


  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  const otpKey = `otp:${email}`

  await redisClient.set(otpKey, otp,{
    EX: 300,
  });


  await redisClient.set(rateLimitKey, "true", {
    EX: 60,
  });

  const message = {
    to: email,
    subject: "Your OTP for Login",
    body: `Your OTP is ${otp}. It will expire in 5 minutes.`
  };

  await publishToQueue("send-otp", message)

  res.status(200).json({
    success: true,
    message: "OTP sent successfully"
  });
});


//OTP Verification 
export const verifyUser = TryCatch(async(req:Request, res:Response, next:NextFunction)=>
{
  const {email, otp:enteredOtp} = req.body

  if(!email || !enteredOtp)
  {
    res.status(400).json({
      message: "Email and OTP are required",
    });
    return;
  }

  const otpKey = `otp:${email}`

  const storedOtp = await redisClient.get(otpKey);

  if(!storedOtp || storedOtp != enteredOtp)
  {
    res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });

    return;
  }

  await redisClient.del(otpKey);

  let user = await User.findOne({email})

  if(!user)
  {
    const name = email.slice(0,8);
    user = await User.create({
      name,
      email
    });
  }

  const token = generateToken(user);
  res.json({
    message:"User Verified",
    token,
    user,
    success:true
  });

});



export const myProfile = TryCatch(async(req:AuthenticatedRequest, res:Response)=>
{
  const user = req.user;

  res.json(user);
});

export const getAllUsers = TryCatch(async(req: AuthenticatedRequest, res: Response) => {

    const users = await User.find();

    res.json(users);
});

export const getAUser = TryCatch(async(req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    res.json({ user });
});

export const updateProfile = TryCatch(async(req: AuthenticatedRequest, res: Response) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (req.body.name) user.name = req.body.name;

  if (req.body.isInvisible !== undefined) user.isInvisible = req.body.isInvisible === "true" || req.body.isInvisible === true;

  if (req.file) {
    if (user.avatar?.publicId) await cloudinary.uploader.destroy(user.avatar.publicId);
    user.avatar = { url: req.file.path, publicId: req.file.filename };
  }

  await user.save();

  const updatedToken = generateToken(user);

  res.json({ message: "Profile updated successfully", token: updatedToken, user });
});

export const deleteAccount = TryCatch(async(req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  // Delete user avatar from cloudinary if exists
  if (user.avatar?.publicId) {
    await cloudinary.uploader.destroy(user.avatar.publicId);
  }

  // Delete user account
  await User.findByIdAndDelete(userId);

  res.json({ 
    success: true,
    message: "Account deleted successfully" 
  });
});