import z from "zod";
import { Role } from "../../../generated/prisma/enums";

const registerSchema = z.object({
  name: z.string("Name is required").min(3, "Name is required"),
  email: z.email("Email is required").includes("@", "Email must be valid"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character",
    ),
  phone: z
    .string()
    .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
    .optional(),
  role: z.enum([Role.DISPATCHER, Role.REQUESTER]).optional(),
});

const loginSchema = z.object({
  email: z.email("Email is required").includes("@", "Email must be valid"),
  password: z.string("Password is required"),
});

const verifyEmailSchema = z.object({
  email: z.email("Email is required").includes("@", "Email must be valid"),
  otp: z.string("OTP is required").length(6, "OTP must be 6 digits"),
});

const forgotPasswordSchema = z.object({
  email: z.email("Email is required").includes("@", "Email must be valid"),
});

const resetPasswordSchema = z.object({
  email: z.email("Email is required").includes("@", "Email must be valid"),
  newPassword: z
    .string("New password is required")
    .min(8, "New password must be at least 8 characters")
    .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
    .regex(/[a-z]/, "New password must contain at least one lowercase letter")
    .regex(/[0-9]/, "New password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "New password must contain at least one special character",
    ),
  otp: z.string("OTP is required").length(6, "OTP must be 6 digits"),
});

export const authValidation = {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
