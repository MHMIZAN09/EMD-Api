import { prisma } from "../../lib/prisma";

const getAnalyticsAdmin = async () => {
	return prisma.$transaction(async (tx) => {
		const [
			totalUsers,
			activeUsers,
			suspendedUsers,
			totalRequesters,
			totalDispatchers,
			totalEmergencies,
			requestedEmergencies,
			verifiedEmergencies,
			assignedEmergencies,
			completedEmergencies,
			cancelledEmergencies,
			totalAmbulances,
			availableAmbulances,
			busyAmbulances,
			offlineAmbulances,
			maintenanceAmbulances,
			totalDispatches,
			activeDispatches,
			completedDispatches,
			cancelledDispatches,
			totalPayments,
			unpaidPayments,
			paidPayments,
			failedPayments,
			cancelledPayments,
			revenue,
		] = await Promise.all([
			tx.user.count({ where: { isDeleted: false } }),
			tx.user.count({ where: { status: "ACTIVE", isDeleted: false } }),
			tx.user.count({ where: { status: "SUSPENDED", isDeleted: false } }),
			tx.user.count({ where: { role: "REQUESTER", isDeleted: false } }),
			tx.user.count({ where: { role: "DISPATCHER", isDeleted: false } }),
			tx.emergencyRequest.count({ where: { deletedAt: null } }),
			tx.emergencyRequest.count({
				where: { status: "REQUESTED", deletedAt: null },
			}),
			tx.emergencyRequest.count({
				where: { status: "VERIFIED", deletedAt: null },
			}),
			tx.emergencyRequest.count({
				where: { status: "ASSIGNED", deletedAt: null },
			}),
			tx.emergencyRequest.count({
				where: { status: "COMPLETED", deletedAt: null },
			}),
			tx.emergencyRequest.count({
				where: { status: "CANCELLED", deletedAt: null },
			}),
			tx.ambulance.count({ where: { deletedAt: null } }),
			tx.ambulance.count({
				where: { status: "AVAILABLE", deletedAt: null },
			}),
			tx.ambulance.count({ where: { status: "BUSY", deletedAt: null } }),
			tx.ambulance.count({ where: { status: "OFFLINE", deletedAt: null } }),
			tx.ambulance.count({
				where: { status: "MAINTENANCE", deletedAt: null },
			}),
			tx.dispatch.count(),
			tx.dispatch.count({
				where: { status: { notIn: ["COMPLETED", "CANCELLED"] } },
			}),
			tx.dispatch.count({ where: { status: "COMPLETED" } }),
			tx.dispatch.count({ where: { status: "CANCELLED" } }),
			tx.payment.count(),
			tx.payment.count({ where: { status: "UNPAID" } }),
			tx.payment.count({ where: { status: "PAID" } }),
			tx.payment.count({ where: { status: "FAILED" } }),
			tx.payment.count({ where: { status: "CANCELLED" } }),
			tx.payment.aggregate({
				where: { status: "PAID" },
				_sum: { amount: true },
			}),
		]);

		return {
			users: {
				total: totalUsers,
				active: activeUsers,
				suspended: suspendedUsers,
				requesters: totalRequesters,
				dispatchers: totalDispatchers,
			},
			emergencies: {
				total: totalEmergencies,
				requested: requestedEmergencies,
				verified: verifiedEmergencies,
				assigned: assignedEmergencies,
				completed: completedEmergencies,
				cancelled: cancelledEmergencies,
			},
			ambulances: {
				total: totalAmbulances,
				available: availableAmbulances,
				busy: busyAmbulances,
				offline: offlineAmbulances,
				maintenance: maintenanceAmbulances,
			},
			dispatches: {
				total: totalDispatches,
				active: activeDispatches,
				completed: completedDispatches,
				cancelled: cancelledDispatches,
			},
			payments: {
				total: totalPayments,
				unpaid: unpaidPayments,
				paid: paidPayments,
				failed: failedPayments,
				cancelled: cancelledPayments,
				totalRevenue: Number(revenue._sum.amount ?? 0),
			},
		};
	});
};

const getAnalyticsDispatcher = async (dispatcherId: string) => {
	return prisma.$transaction(async (tx) => {
		const [
			assignedDispatches,
			activeDispatches,
			completedDispatches,
			cancelledDispatches,
			availableAmbulances,
			busyAmbulances,
			totalEmergencies,
			requestedEmergencies,
			verifiedEmergencies,
			assignedEmergencies,
			completedEmergencies,
		] = await Promise.all([
			tx.dispatch.count({ where: { assignedById: dispatcherId } }),
			tx.dispatch.count({
				where: {
					assignedById: dispatcherId,
					status: { notIn: ["COMPLETED", "CANCELLED"] },
				},
			}),
			tx.dispatch.count({
				where: { assignedById: dispatcherId, status: "COMPLETED" },
			}),
			tx.dispatch.count({
				where: { assignedById: dispatcherId, status: "CANCELLED" },
			}),
			tx.ambulance.count({
				where: { status: "AVAILABLE", deletedAt: null },
			}),
			tx.ambulance.count({ where: { status: "BUSY", deletedAt: null } }),
			tx.emergencyRequest.count({ where: { deletedAt: null } }),
			tx.emergencyRequest.count({
				where: { status: "REQUESTED", deletedAt: null },
			}),
			tx.emergencyRequest.count({
				where: { status: "VERIFIED", deletedAt: null },
			}),
			tx.emergencyRequest.count({
				where: { status: "ASSIGNED", deletedAt: null },
			}),
			tx.emergencyRequest.count({
				where: { status: "COMPLETED", deletedAt: null },
			}),
		]);

		return {
			dispatches: {
				assigned: assignedDispatches,
				active: activeDispatches,
				completed: completedDispatches,
				cancelled: cancelledDispatches,
			},
			ambulances: {
				available: availableAmbulances,
				busy: busyAmbulances,
			},
			emergencies: {
				total: totalEmergencies,
				requested: requestedEmergencies,
				verified: verifiedEmergencies,
				assigned: assignedEmergencies,
				completed: completedEmergencies,
			},
		};
	});
};

const getAnalyticsRequester = async (requesterId: string) => {
	return prisma.$transaction(async (tx) => {
		const emergencyWhere = { userId: requesterId, deletedAt: null };
		const [
			totalEmergencies,
			requestedEmergencies,
			verifiedEmergencies,
			assignedEmergencies,
			completedEmergencies,
			cancelledEmergencies,
			totalPayments,
			unpaidPayments,
			paidPayments,
			failedPayments,
			refundAmount,
		] = await Promise.all([
			tx.emergencyRequest.count({ where: emergencyWhere }),
			tx.emergencyRequest.count({
				where: { ...emergencyWhere, status: "REQUESTED" },
			}),
			tx.emergencyRequest.count({
				where: { ...emergencyWhere, status: "VERIFIED" },
			}),
			tx.emergencyRequest.count({
				where: { ...emergencyWhere, status: "ASSIGNED" },
			}),
			tx.emergencyRequest.count({
				where: { ...emergencyWhere, status: "COMPLETED" },
			}),
			tx.emergencyRequest.count({
				where: { ...emergencyWhere, status: "CANCELLED" },
			}),
			tx.payment.count({
				where: { emergency: { userId: requesterId } },
			}),
			tx.payment.count({
				where: { emergency: { userId: requesterId }, status: "UNPAID" },
			}),
			tx.payment.count({
				where: { emergency: { userId: requesterId }, status: "PAID" },
			}),
			tx.payment.count({
				where: { emergency: { userId: requesterId }, status: "FAILED" },
			}),
			tx.payment.aggregate({
				where: { emergency: { userId: requesterId }, status: "PAID" },
				_sum: { amount: true },
			}),
		]);

		return {
			emergencies: {
				total: totalEmergencies,
				requested: requestedEmergencies,
				verified: verifiedEmergencies,
				assigned: assignedEmergencies,
				completed: completedEmergencies,
				cancelled: cancelledEmergencies,
			},
			payments: {
				total: totalPayments,
				unpaid: unpaidPayments,
				paid: paidPayments,
				failed: failedPayments,
				totalSpent: Number(refundAmount._sum.amount ?? 0),
			},
		};
	});
};

export const dashboardService = {
	getAnalyticsAdmin,
	getAnalyticsDispatcher,
	getAnalyticsRequester,
};
