import { Request, Response } from "express";
import ApiError from "../../../utils/apiErrors";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import * as AuthService from "./auth.service";

export const signup = catchAsync(async (req: Request, res: Response) => {
  const user = await AuthService.signup(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Account created. Please verify your email.",
    data: user,
  });
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const token = req.query.token as string;

  if (!token) {
    throw new ApiError(400, "Invalid or missing token");
  }

  const result = await AuthService.verifyEmail(token);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: result.message,
    data: null,
  });
});

export const resendEmailVerification = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.resendEmailVerification(req.body.email);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
      data: null,
    });
  },
);

// auth.controller.ts
export const signin = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await AuthService.signin(email, password, res);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Signed in successfully",
    data: result,
  });
});

export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const result = await AuthService.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Token refreshed",
    data: result,
  });
});

export const requestPasswordReset = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.requestPasswordReset(req.body.email);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
      data: null,
    });
  },
);

export const verifyResetCode = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.verifyResetCode(
      req.body.email,
      req.body.code,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
      data: null,
    });
  },
);

export const resetPasswordController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.resetPassword(
      req.body.email,
      req.body.code,
      req.body.newPassword,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
      data: null,
    });
  },
);

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await AuthService.getMe(req.user!.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User fetched",
    data: user,
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

export const changePasswordController = catchAsync(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const result = await AuthService.changePassword(
      req.user!.id,
      oldPassword,
      newPassword,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: result.message,
      data: null,
    });
  },
);
