import User from "../../models/usermodel.js";

import generateToken from "../../utils/generateToken.js";
import CustomError from "../../utils/customError.js";

import OTPModel from "../../models/otpModel.js";

import EmailUtility from "../../utils/sendEmail.js";
import bcrypt from "bcryptjs";


// Register Service
export const registerService = async (
  validatedData
) => {

  const {
    name,
    email,
    password,
    image,
  } = validatedData;


  // Check Existing User
  const existingUser =
    await User.findOne({ email });

  if (existingUser) {

   throw new CustomError(
  "User already exists",
  409
);
  }

   const hashedPassword =
    await bcrypt.hash(password, 10);


  // Create User
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    image,
  });


  return {
    id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
  };

};



// Login Service
export const loginService = async (
  validatedData
) => {

  const { email, password } =
    validatedData;


  // Find User
  const user = await User.findOne({
    email,
  });

  if (!user) {
throw new CustomError(
  "Invalid email or password",
  401
);

  }


  
 // Compare Password
  const isPasswordMatched =
    await bcrypt.compare(
      password,
      user.password
    );

      if (!isPasswordMatched) {

    throw new CustomError(
      "Invalid email or password",
      401
    );

  }


  // Generate Token
  const token = generateToken({
    id: user._id,
  });


  return {
    token,

    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
  };

};

export const getCurrentUserService = async (
  userId
) => {

  const user = await User.findById(
    userId
  );


  if (!user) {

    throw new CustomError(
      "User not found",
      404
    );

  }


  return user;

};

// Update User Service
export const updateUserService = async (
  userId,
  validatedData
) => {

  const updatedUser =
    await User.findByIdAndUpdate(
      userId,
      validatedData,
      {
        new: true,
      }
    );


  if (!updatedUser) {

    throw new CustomError(
      "User not found",
      404
    );

  }


  return updatedUser;

};


export const sendOTPService = async (
  validatedData
) => {

  const { email } = validatedData;


  // Check User Exists
  const user = await User.findOne({
    email,
  });

  if (!user) {

    throw new CustomError(
      "User not found",
      404
    );

  }


  // Generate OTP
  const otp =
    Math.floor(
      100000 + Math.random() * 900000
    ).toString();


  // Remove previous OTP
  await OTPModel.deleteMany({
    email,
  });


  // Save OTP
  await OTPModel.create({
    email,
    otp,
   
  });


  // Send Email
  await EmailUtility(
    email,
    `<h1>Your OTP is ${otp}</h1>`,
    "Expense Tracker OTP"
  );


  return;

};

// Verify OTP Service
export const verifyOTPService = async (
  validatedData
) => {

  const { email, otp } =
    validatedData;


  const existingOTP =
    await OTPModel.findOne({
      email,
      otp,
      status: 0,
    });


  if (!existingOTP) {

    throw new CustomError(
      "Invalid OTP",
      400
    );

  }


  // Check Expiration
  if (
    existingOTP.expiresAt <
    new Date()
  ) {

    throw new CustomError(
      "OTP expired",
      400
    );

  }


  existingOTP.status = 1;

  await existingOTP.save();


  return;

};

// Reset Password Service
export const resetPasswordService =
  async (validatedData) => {

    const { email, password } =
      validatedData;


    // Check Verified OTP
    const verifiedOTP =
      await OTPModel.findOne({
        email,
        status: 1,
      });


    if (!verifiedOTP) {

      throw new CustomError(
        "OTP verification required",
        400
      );

    }

     const hashedPassword =
      await bcrypt.hash(password, 10);


    // Update Password
    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      }
    );


    // Remove OTP
    await OTPModel.deleteMany({
      email,
    });


    return;

};