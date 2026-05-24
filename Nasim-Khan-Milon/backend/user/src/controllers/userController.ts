import { generateToken } from '../config/generateToken.js';
import { publishToQueue } from '../config/rabbitmq.js';
import TryCatch from '../config/TryCatch.js';
import prisma from '../config/prisma.js';
import { redisClient } from '../index.js';
import type { AuthenticatedRequest } from '../middlewares/isAuth.js';



export const loginUser = TryCatch(async (req, res) => {

    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const rateLimitKey = `otp:ratelimit:${email}`;
    const rateLimit = await redisClient.get(rateLimitKey);

    if (rateLimit) {
        res.status(429).json({ message: "Too many requests. Please try again later." });
        return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpKey = `otp:${email}`;
    await redisClient.set(otpKey, otp, {
        EX: 300,
    });

    await redisClient.set(rateLimitKey, 'true', {
        EX: 60,
    });

    const message = {
        to: email,
        subject: "Your OTP Code",
        body: `Your OTP code is ${otp}. It will expire in 5 minutes.`
    };

    await publishToQueue('send_otp', message);

    res.status(200).json({ message: "OTP sent to your email" });

})

export const verifyUser = TryCatch(async (req, res) => {
    const { email, otp: enteredOtp } = req.body;

    if (!email || !enteredOtp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpKey = `otp:${email}`;
    const storedOtp = await redisClient.get(otpKey);

    if (!storedOtp) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (enteredOtp !== storedOtp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    await redisClient.del(otpKey); // Remove the used OTP

    let user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        const name = email.split("@")[0];
        user = await prisma.user.create({ data: { name, email } });
    }

    const token = generateToken(user);

    res.status(200).json({ message: "User verified successfully", user, token });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
});

export const getAllUsers = TryCatch(async (req: AuthenticatedRequest, res) => {
    const users = await prisma.user.findMany();
    res.status(200).json({ users });
});

export const getAUser = TryCatch(async (req: AuthenticatedRequest, res) => {
    const userId = req.params.id;

    if (!userId || Array.isArray(userId)) {
        return res.status(400).json({
            message: "Invalid user id",
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
});

export const updateName = TryCatch(async (req: AuthenticatedRequest, res) => {

    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: "Name is required" });
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: req.user.id,
        },
        data: {
            name,
        },
    });

    const token = generateToken(updatedUser);

    res.status(200).json({ message: "Name updated successfully", user: updatedUser, token });

});
