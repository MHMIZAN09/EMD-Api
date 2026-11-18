import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { userService } from "./user.service";

//! update user profile
const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not logged in. Please log in to access this resource.",
    );
  }
  const payload = req.body;

  const result = await userService.updateProfile(userId, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile updated successfully",
    data: result,
  });
});

//! get user profile
const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not logged in. Please log in to access this resource.",
    );
  }

  const result = await userService.getProfile(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result,
  });
});

export const userController = {
  updateProfile,
  getProfile,
};
