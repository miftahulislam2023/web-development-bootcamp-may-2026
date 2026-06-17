
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/jwttoken");

const RegisterUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    console.log("Registering user with data:", { name, email });
    try{
        if(!name || !email || !password || !confirmPassword){
            return res.status(400).json({message: "All fields are required"});
        }
        if(password !== confirmPassword){
            return res.status(400).json({message: "Passwords do not match"});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,  
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({message: "User registered successfully"});
    }catch(error){
        console.error("Error registering user:", error);
        res.status(500).json({message: "Server error"});
    }
};

const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    try{
        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const tokenExpire=moment().add(process.env.JWT_ACCESS_EXPIRATION, "minute");

        const accessToken= await generateToken(user._id, tokenExpire, "access");

         res.send({
         message: "Login successful!",
            data: {
             id: user._id,
             name: user.name,
             email: user.email,
             access: {
              token: accessToken,
              expires: tokenExpire.toDate(),
              expiresIn: process.env.JWT_ACCESS_EXPIRATION * 60,
        },
    },
    });
    }catch(error){
        console.error("Error logging in user:", error);
        res.status(500).json({message: "Server error"});
    }
};



module.exports = {
    RegisterUser,
    LoginUser,
} 