import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ambulanceService } from "./ambulance.service";

const getAllAmbulances = catchAsync(async (req: Request, res: Response) => {
  const ambulances = await ambulanceService.getAllAmbulances();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ambulances retrieved successfully",
    data: ambulances,
  });
});

const getAmbulanceById = catchAsync(async (req: Request, res: Response) => {
  const ambulanceId = req.params.id;

  const ambulance = await ambulanceService.getAmbulanceById(
    ambulanceId as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Ambulance retrieved successfully",
    data: ambulance,
  });
});

const getAvailableAmbulances = catchAsync(
  async (req: Request, res: Response) => {
    const ambulances = await ambulanceService.getAvailableAmbulances();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Available ambulances retrieved successfully",
      data: ambulances,
    });
  },
);

const updateAmbulanceStatus = catchAsync(
  async (req: Request, res: Response) => {
    const ambulanceId = req.params.id;
    const payload = req.body;

    const ambulance = await ambulanceService.updateAmbulanceStatus(
      ambulanceId as string,
      payload,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Ambulance status updated successfully",
      data: ambulance,
    });
  },
);

const updateAmbulanceLocation = catchAsync(
  async (req: Request, res: Response) => {
    const ambulanceId = req.params.id;
    const payload = req.body;

    const ambulance = await ambulanceService.updateAmbulanceLocation(
      ambulanceId as string,
      payload,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Ambulance location updated successfully",
      data: ambulance,
    });
  },
);

export const ambulanceController = {
  getAllAmbulances,
  getAmbulanceById,
  getAvailableAmbulances,
  updateAmbulanceStatus,
  updateAmbulanceLocation,
};
