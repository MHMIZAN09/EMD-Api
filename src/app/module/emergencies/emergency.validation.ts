import z from "zod";

const createEmergencySchema = z.object({
  patientName: z.string().trim().min(1).max(100),
  patientAge: z.number().int().positive().optional(),
  bloodGroup: z
    .enum([
      "A_POSITIVE",
      "A_NEGATIVE",
      "B_POSITIVE",
      "B_NEGATIVE",
      "AB_POSITIVE",
      "AB_NEGATIVE",
      "O_POSITIVE",
      "O_NEGATIVE",
    ])
    .optional(),
  description: z.string().trim().min(1).max(500),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  pickupAddress: z.string().trim().min(1).max(200),
  pickupLat: z.number().min(-90).max(90),
  pickupLng: z.number().min(-180).max(180),
});

const updateEmergencySchema = z.object({
  patientName: z.string().trim().min(1).max(100).optional(),
  patientAge: z.number().int().positive().optional(),
  bloodGroup: z
    .enum([
      "A_POSITIVE",
      "A_NEGATIVE",
      "B_POSITIVE",
      "B_NEGATIVE",
      "AB_POSITIVE",
      "AB_NEGATIVE",
      "O_POSITIVE",
      "O_NEGATIVE",
    ])
    .optional(),
  description: z.string().trim().min(1).max(500).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  pickupAddress: z.string().trim().min(1).max(200).optional(),
  pickupLat: z.number().min(-90).max(90).optional(),
  pickupLng: z.number().min(-180).max(180).optional(),
});

const assignHospitalSchema = z.object({
  hospitalId: z.uuid("Hospital ID must be a valid UUID"),
});

export const EmergencyValidation = {
  createEmergencySchema,
  updateEmergencySchema,
  assignHospitalSchema,
};
