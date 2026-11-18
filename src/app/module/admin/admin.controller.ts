import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/AppError";
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "http-status";
import { userService } from "../users/user.service";
import { sendResponse } from "../../utils/sendResponse";
import { ambulanceService } from "../ambulance/ambulance.service";

//! get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const users = await userService.getAllUsers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users fetched successfully",
    data: users,
  });
});

//! get user details by id
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const userId = req.params.id;

  const userDetails = await userService.getUserDetails(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User details fetched successfully",
    data: userDetails,
  });
});

//! changeUserStatus
const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const userId = req.params.id;
  const { status } = req.body;

  const updatedUser = await userService.changeUserStatus(
    userId as string,
    status,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User status updated successfully",
    data: updatedUser,
  });
});

//! changeUserRole
const changeUserRole = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const userId = req.params.id;
  const { role } = req.body;

  const updatedUser = await userService.changeUserRole(userId as string, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User role updated successfully",
    data: updatedUser,
  });
});

//! deleteUser
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const userId = req.params.id;

  const deletedUser = await userService.softDeleteUser(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: deletedUser,
  });
});

//! ambulance management

const createAmbulance = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const payload = req.body;

  const ambulance = await ambulanceService.createAmbulance(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Ambulance created successfully",
    data: ambulance,
  });
});

const updateAmbulance = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const ambulanceId = req.params.id;
  const payload = req.body;

  const updatedAmbulance = await ambulanceService.updateAmbulance(
    ambulanceId as string,
    payload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ambulance updated successfully",
    data: updatedAmbulance,
  });
});

const deleteAmbulance = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const ambulanceId = req.params.id;

  const deletedAmbulance = await ambulanceService.deleteAmbulance(
    ambulanceId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Ambulance deleted successfully",
    data: deletedAmbulance,
  });
});

export const adminController = {
  getAllUsers,
  getUserById,
  changeUserStatus,
  changeUserRole,
  deleteUser,
  createAmbulance,
  updateAmbulance,
  deleteAmbulance,
};
