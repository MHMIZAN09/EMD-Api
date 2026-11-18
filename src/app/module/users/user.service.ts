import { Role, UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { IUserUpdatePayload } from "./user.interface";
import httpStatus from "http-status";

//! update user profile
const updateProfile = async (userId: string, payload: IUserUpdatePayload) => {
  const { name, phone } = payload;

  const isUserExists = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!isUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (isUserExists.status === UserStatus.SUSPENDED) {
    throw new AppError(httpStatus.FORBIDDEN, "User is suspended");
  }
  if (isUserExists.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      phone,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
    },
  });
  return updatedUser;
};

//! get user profile
const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      imageUrl: true,
      lastLoginAt: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.status === UserStatus.SUSPENDED) {
    throw new AppError(httpStatus.FORBIDDEN, "User is suspended");
  }
  return user;
};

//! get all users only for admin
const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    omit: {
      password: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return users;
};

//! user details
const getUserDetails = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.status === UserStatus.SUSPENDED) {
    throw new AppError(httpStatus.FORBIDDEN, "User is suspended");
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }
  return user;
};

//! change user status only for admin
const changeUserStatus = async (userId: string, status: UserStatus) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.status === status) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is already ${status.toLowerCase()}`,
    );
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
    },
  });

  return updatedUser;
};

//! chnage user role only for admin
const changeUserRole = async (userId: string, role: Role) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role === role) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is already ${role.toLowerCase()}`,
    );
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
    },
  });

  return updatedUser;
};

//! user soft delete only for admin
const softDeleteUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is already deleted");
  }

  const deletedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      isDeleted: true,
      deletedAt: true,
    },
  });

  return deletedUser;
};

export const userService = {
  updateProfile,
  getProfile,
  getAllUsers,
  getUserDetails,
  changeUserStatus,
  changeUserRole,
  softDeleteUser,
};
