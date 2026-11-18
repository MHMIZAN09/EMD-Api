import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../utils/AppError";
import { Role } from "../../../generated/prisma/enums";
import httpStatus from "http-status";
import { userService } from "../users/user.service";
import { sendResponse } from "../../utils/sendResponse";
import { ambulanceService } from "../ambulance/ambulance.service";
import { hospitalService } from "../hospital/hospital.service";
import { driverService } from "../driver/driver.service";

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

//! hospital management

const createHospital = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const payload = req.body;

  const hospital = await hospitalService.createHospital(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Hospital created successfully",
    data: hospital,
  });
});

const updateHospital = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const hospitalId = req.params.id;
  const payload = req.body;

  const updatedHospital = await hospitalService.updateHospital(
    hospitalId as string,
    payload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospital updated successfully",
    data: updatedHospital,
  });
});

const deleteHospital = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const hospitalId = req.params.id;

  const deletedHospital = await hospitalService.deleteHospital(
    hospitalId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospital deleted successfully",
    data: deletedHospital,
  });
});

const getAllHospitals = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const hospitals = await hospitalService.getAllHospitals();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospitals retrieved successfully",
    data: hospitals,
  });
});

const getHospitalById = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const hospitalId = req.params.id;

  const hospital = await hospitalService.getHospitalByIdByAdmin(
    hospitalId as string,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospital retrieved successfully",
    data: hospital,
  });
});

const hospitalStatus = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const hospitalId = req.params.id;
  const { status } = req.body;

  const updatedHospital = await hospitalService.hospitalStatus(
    hospitalId as string,
    status,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospital status updated successfully",
    data: updatedHospital,
  });
});

const createDriver = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const payload = req.body;

  const driver = await driverService.createDriver(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Driver created successfully",
    data: driver,
  });
});

const updateDriver = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const driverId = req.params.id;
  const payload = req.body;

  const updatedDriver = await driverService.updateDriver(
    driverId as string,
    payload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Driver updated successfully",
    data: updatedDriver,
  });
});

const deleteDriver = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (user?.role !== Role.ADMIN) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to access this resource.",
    );
  }

  const driverId = req.params.id;

  const deletedDriver = await driverService.deleteDriver(driverId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Driver deleted successfully",
    data: deletedDriver,
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

  //! hospital management
  createHospital,
  updateHospital,
  deleteHospital,
  getAllHospitals,
  getHospitalById,
  hospitalStatus,

  //! driver management
  createDriver,
  updateDriver,
  deleteDriver,
};
