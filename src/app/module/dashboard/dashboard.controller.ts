import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { dashboardService } from "./dashboard.service";

const getAuthenticatedUserId = (req: Request) => {
	const userId = req.user?.userId;
	if (!userId) {
		throw new AppError(401, "Authentication is required");
	}
	return userId;
};

const getAnalyticsAdmin = catchAsync(async (_req: Request, res: Response) => {
	const result = await dashboardService.getAnalyticsAdmin();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Admin dashboard analytics retrieved successfully",
		data: result,
	});
});

const getAnalyticsDispatcher = catchAsync(
	async (req: Request, res: Response) => {
		const result = await dashboardService.getAnalyticsDispatcher(
			getAuthenticatedUserId(req),
		);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Dispatcher dashboard analytics retrieved successfully",
			data: result,
		});
	},
);

const getAnalyticsRequester = catchAsync(
	async (req: Request, res: Response) => {
		const result = await dashboardService.getAnalyticsRequester(
			getAuthenticatedUserId(req),
		);

		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Requester dashboard analytics retrieved successfully",
			data: result,
		});
	},
);

export const dashboardController = {
	getAnalyticsAdmin,
	getAnalyticsDispatcher,
	getAnalyticsRequester,
};
