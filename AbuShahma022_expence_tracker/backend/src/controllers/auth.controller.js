import {
  registerValidationSchema,
  loginValidationSchema,
    updateUserValidationSchema,
    sendOTPValidationSchema,
    verifyOTPValidationSchema,
    resetPasswordValidationSchema
} from "../validation/auth.validation.js";

import {
  registerService,
  loginService,
  getCurrentUserService,
  updateUserService,
  sendOTPService,
  verifyOTPService,
  resetPasswordService
} from "../services/auth/auth.service.js";


// Register Controller
export const registerUser = async (
  req,
  res,
  next
) => {

  try {

    const validatedData =
      registerValidationSchema.parse(
        req.body
      );

    const user =
      await registerService(
        validatedData
      );


    res.status(201).json({
      success: true,
      message:
        "User registered successfully",
      data: user,
    });

  } catch (error) {

    next(error);

  }

};



// Login Controller
export const loginUser = async (
  req,
  res,
  next
) => {

  try {

    const validatedData =
      loginValidationSchema.parse(
        req.body
      );

    const result =
      await loginService(
        validatedData
      );


    res.cookie(
      "token",
      result.token,
      {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge:
          7 *
          24 *
          60 *
          60 *
          1000,
      }
    );


    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      data: result.user,
    });

  } catch (error) {

    next(error);

  }

};

export const logoutUser = async (
  req,
  res,
  next
) => {

  try {

    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {

    next(error);

  }

};

export const getCurrentUser = async (
  req,
  res,
  next
) => {

  try {

    const user =
      await getCurrentUserService(
        req.user.id
      );


    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {

    next(error);

  }

};

export const updateUser = async (
  req,
  res,
  next
) => {

  try {

    const validatedData =
      updateUserValidationSchema.parse(
        req.body
      );


    const updatedUser =
      await updateUserService(
        req.user.id,
        validatedData
      );


    res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      data: updatedUser,
    });

  } catch (error) {

    next(error);

  }

};

export const sendOTP = async (
  req,
  res,
  next
) => {

  try {

    const validatedData =
      sendOTPValidationSchema.parse(
        req.body
      );


    await sendOTPService(
      validatedData
    );


    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {

    next(error);

  }

};


export const verifyOTP = async (
  req,
  res,
  next
) => {

  try {

    const validatedData =
      verifyOTPValidationSchema.parse(
        req.body
      );


    await verifyOTPService(
      validatedData
    );


    res.status(200).json({
      success: true,
      message: "OTP verified",
    });

  } catch (error) {

    next(error);

  }

};


export const resetPassword = async (
  req,
  res,
  next
) => {

  try {

    const validatedData =
      resetPasswordValidationSchema.parse(
        req.body
      );


    await resetPasswordService(
      validatedData
    );


    res.status(200).json({
      success: true,
      message:
        "Password reset successful",
    });

  } catch (error) {

    next(error);

  }

};