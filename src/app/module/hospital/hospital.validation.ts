// export interface IHospitalUpdatePayload {
//   name?: string;
//   address?: string;
//   phone?: string;
//   email?: string;
//   latitude?: number;
//   longitude?: number;
//   status?: HospitalStatus;
// }

import z from "zod";
import { HospitalStatus } from "../../../generated/prisma/enums";

const hospitalPayloadSchema = z.object({
  name: z.string().min(1, "Hospital name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.email("Invalid email address").optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  status: z
    .enum([
      HospitalStatus.CLOSED,
      HospitalStatus.OPEN,
      HospitalStatus.MAINTENANCE,
    ])
    .optional(),
});

const hospitalUpdatePayloadSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.email("Invalid email address").optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  status: z
    .enum([
      HospitalStatus.CLOSED,
      HospitalStatus.OPEN,
      HospitalStatus.MAINTENANCE,
    ])
    .optional(),
});

const hospitalStausPayloadSchema = z.object({
  status: z
    .enum([
      HospitalStatus.CLOSED,
      HospitalStatus.OPEN,
      HospitalStatus.MAINTENANCE,
    ])
    .optional(),
});

export const hospitalValidation = {
  hospitalPayloadSchema,
  hospitalUpdatePayloadSchema,
  hospitalStausPayloadSchema,
};
