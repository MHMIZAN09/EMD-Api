import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { IUserLoginPayload, IUserRegisterPayload } from "./auth.interface";
import httpStatus from "http-status";

import argon2 from "argon2";
import { Role } from "../../../generated/prisma/enums";

//! register user
const registerUser = async (payload: IUserRegisterPayload) => {
  const { name, email, password, phone } = payload;
  const normalizedEmail = normalizeEmail(email);
  const normalizedPhone = normalizePhoneNumber(phone as string);

  await ensureUserExists(normalizedEmail);

  const hashedPassword = await argon2.hash(password);

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone: normalizedPhone,
      role: Role.REQUESTER,
    },
    omit: {
      password: true,
    },
  });

  return user;
};



//! login user
const loginUser = async (payload: IUserLoginPayload) => {
  const { email, password } = payload;
  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordValid = await argon2.verify(user.password, password);

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
  }

  return user;
};


//! normalize email to lowercase and trim whitespace
export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};


//! normalize phone number to remove whitespace
export const normalizePhoneNumber = (phoneNumber: string): string => {
  return phoneNumber.trim();
};

//! ensure user with the same email does not exist
export const ensureUserExists = async (email: string) => {
  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (user) {
    throw new AppError(
      httpStatus.CONFLICT,
      "User with this email already exists",
    );
  }
};

export const authService = {
  registerUser,
  loginUser,
};
