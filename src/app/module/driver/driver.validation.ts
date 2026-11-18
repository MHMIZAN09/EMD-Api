import z from "zod";

const driverPayloadSchema = z.object({
  name: z.string().min(1, "Driver name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  ambulanceId: z.uuid().optional(),
});

const driverUpdatePayloadSchema = z.object({
  name: z.string().optional(),
  email: z.email("Invalid email address").optional(),
  phone: z.string().optional(),
  ambulanceId: z.uuid().optional(),
});

const driverAmbulancePayloadSchema = z.object({
  ambulanceId: z.uuid(),
});

export const driverValidation = {
  driverPayloadSchema,
  driverUpdatePayloadSchema,
  driverAmbulancePayloadSchema,
};
