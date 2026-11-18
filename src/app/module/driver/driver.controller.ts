import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { driverService } from "./driver.service";
import httpStatus from "http-status";

const assignAmbulanceToDriver = catchAsync(
  async (req: Request, res: Response) => {
    const driverId = req.params.id;
    const payload = req.body;

    const updatedDriver = await driverService.assignAmbulanceToDriver(
      driverId as string,
      payload,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Ambulance assigned to driver successfully",
      data: updatedDriver,
    });
  },
);

const getAllDrivers = catchAsync(async (req: Request, res: Response) => {
  const drivers = await driverService.getAllDrivers();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Drivers retrieved successfully",
    data: drivers,
  });
});

const getDriverById = catchAsync(async (req: Request, res: Response) => {
  const driverId = req.params.id;

  const driver = await driverService.getDriverById(driverId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Driver retrieved successfully",
    data: driver,
  });
});

export const driverController = {
  assignAmbulanceToDriver,
  getAllDrivers,
  getDriverById,
};
