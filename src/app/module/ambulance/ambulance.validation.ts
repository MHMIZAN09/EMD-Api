import z from "zod";
import {
  AmbulanceStatus,
  AmbulanceType,
} from "../../../generated/prisma/enums";

const ambulancePayloadSchema = z.object({
  licensePlate: z.string().min(1, "License plate is required"),
  model: z.string().min(1, "Model is required"),
  manufacturer: z.string().optional(),
  year: z.number().optional(),
  type: z.enum(
    [
      AmbulanceType.BASIC,
      AmbulanceType.ADVANCED_LIFE_SUPPORT,
      AmbulanceType.NEONATAL,
      AmbulanceType.PATIENT_TRANSPORT,
      AmbulanceType.FREEZER,
      AmbulanceType.AIR_AMBULANCE,
    ],
    "Invalid ambulance type",
  ),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  status: z.enum(
    [
      AmbulanceStatus.AVAILABLE,
      AmbulanceStatus.BUSY,
      AmbulanceStatus.OFFLINE,
      AmbulanceStatus.MAINTENANCE,
    ],
    "Invalid ambulance status",
  ),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  baseFare: z.string().min(1, "Base fare is required"),
  perKmFare: z.string().min(1, "Per km fare is required"),
});

const ambulanceStatusPayloadSchema = z.object({
  status: z.enum(
    [
      AmbulanceStatus.AVAILABLE,
      AmbulanceStatus.BUSY,
      AmbulanceStatus.OFFLINE,
      AmbulanceStatus.MAINTENANCE,
    ],
    "Invalid ambulance status",
  ),
});

const ambulanceLocationPayloadSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const ambulanceUpdatePayloadSchema = z.object({
  licensePlate: z.string().optional(),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  year: z.number().optional(),
  type: z
    .enum(
      [
        AmbulanceType.BASIC,
        AmbulanceType.ADVANCED_LIFE_SUPPORT,
        AmbulanceType.NEONATAL,
        AmbulanceType.PATIENT_TRANSPORT,
        AmbulanceType.FREEZER,
        AmbulanceType.AIR_AMBULANCE,
      ],
      "Invalid ambulance type",
    )
    .optional(),
  capacity: z.number().min(1, "Capacity must be at least 1").optional(),
  status: z
    .enum(
      [
        AmbulanceStatus.AVAILABLE,
        AmbulanceStatus.BUSY,
        AmbulanceStatus.OFFLINE,
        AmbulanceStatus.MAINTENANCE,
      ],
      "Invalid ambulance status",
    )
    .optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  baseFare: z.string().optional(),
  perKmFare: z.string().optional(),
});

export const ambulanceValidation = {
  ambulancePayloadSchema,
  ambulanceStatusPayloadSchema,
  ambulanceLocationPayloadSchema,
  ambulanceUpdatePayloadSchema,
};
