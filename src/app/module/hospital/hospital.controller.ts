import type { Request, Response } from "express";
import { hospitalService } from "./hospital.service";

import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const getAllHospitals = catchAsync(async (req: Request, res: Response) => {
  const hospitals = await hospitalService.getAllHospitals();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospitals retrieved successfully",
    data: hospitals,
  });
});

const getNearbyHospitals = catchAsync(
  async (req: Request, res: Response) => {},
);

const getHospitalById = catchAsync(async (req: Request, res: Response) => {
  const hospitalId = req.params.id;

  const hospital = await hospitalService.getHospitalById(hospitalId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Hospital retrieved successfully",
    data: hospital,
  });
});

export const hospitalController = {
  getAllHospitals,
  getNearbyHospitals,
  getHospitalById,
};
