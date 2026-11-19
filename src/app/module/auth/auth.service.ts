import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type {
	IChangePasswordPayload,
	IForgotPasswordPayload,
	IRequestUser,
	IResetPasswordPayload,
	IUserLoginPayload,
	IUserRegisterPayload,
	IVerifyEmailPayload,
} from "./auth.interface";
import httpStatus from "http-status";

import argon2 from "argon2";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { jwtUtils } from "../../utils/jwt";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import config from "../../config";
import crypto from "crypto";
import ejs from "ejs";
import { redisClient } from "../../lib/redis";
import path from "path";
import { transporter } from "../../lib/nodeMailer";

const sendEmailVerificationOtp = async ({
	name,
	email,
	password,
	role,
}: {
	name: string;
	email: string;
	password?: string;
	role?: Role;
}) => {
	const expirationSeconds = 5 * 60;
	const otpKey = `user-registration-otp:${email}`;
	const otpValue = crypto.randomInt(100000, 1000000).toString();

	if (config.node_env === "development") {
		console.log(`[dev] OTP ${email} : ${otpValue}`);
	}

	await redisClient.set(otpKey, otpValue, {
		expiration: {
			type: "EX",
			value: expirationSeconds,
		},
	});

	if (password && role) {
		const userRegistrationKey = `user-registration-data:${email}`;
		await redisClient.set(
			userRegistrationKey,
			JSON.stringify({ name, email, password, role }),
			{
				expiration: {
					type: "EX",
					value: expirationSeconds,
				},
			},
		);
	}

	const templatePath = path.join(
		process.cwd(),
		"src/templates/registration-user-otp.ejs",
	);

	const templateData = {
		name,
		email,
		otp: otpValue,
		expirationMinutes: expirationSeconds / 60,
	};

	const html = await ejs.renderFile(templatePath, templateData);

	await transporter.sendMail({
		from: config.email_sender,
		to: email,
		subject: "Email Verification",
		html,
	});
};

//! register user
const registerUser = async (payload: IUserRegisterPayload) => {
	const { name, email, password, phone } = payload;
	const normalizedEmail = normalizeEmail(email);
	const normalizedPhone = normalizePhoneNumber(phone as string);

	await ensureUserExists(normalizedEmail);

	const hashedPassword = await argon2.hash(password);

	// const user = await prisma.user.create({
	//   data: {
	//     name,
	//     email: normalizedEmail,
	//     password: hashedPassword,
	//     phone: normalizedPhone,
	//     role: Role.REQUESTER,
	//   },
	//   omit: {
	//     password: true,
	//   },
	// });

	// return user;

	await sendEmailVerificationOtp({
		name,
		email: normalizedEmail,
		password: hashedPassword,
		role: Role.REQUESTER,
	});
};

const verifyUserEmail = async (payload: IVerifyEmailPayload) => {
	const otp = payload.otp;
	const email = payload.email.trim().toLowerCase();

	const isUserExist = await prisma.user.findUnique({
		where: { email },
	});

	if (isUserExist?.status === "SUSPENDED") {
		throw new Error("User is Suspended, please contact support");
	}

	if (isUserExist?.emailVerified) {
		throw new Error("Email ALready Verified");
	}

	if (isUserExist?.isDeleted) {
		throw new Error("User is Deleted");
	}

	const otpKey = `user-registration-otp:${email}`;

	const redisOtp = await redisClient.get(otpKey);

	if (!redisOtp) {
		throw new Error("Invalid OTP");
	}

	if (redisOtp !== otp) {
		throw new Error("OTP Does Not Match");
	}

	await redisClient.del(otpKey);

	const userRegistrationKey = `user-registration-data:${email}`;
	const redisUserData = await redisClient.get(userRegistrationKey);
	const userPayload = redisUserData ? JSON.parse(redisUserData) : null;

	const verifiedUser = isUserExist
		? await prisma.user.update({
				where: { id: isUserExist.id },
				data: {
					emailVerified: true,
					status: UserStatus.ACTIVE,
				},
				omit: { password: true },
			})
		: userPayload
			? await prisma.user.create({
					data: {
						name: userPayload.name,
						email: userPayload.email,
						password: userPayload.password,
						role: userPayload.role,
						status: UserStatus.ACTIVE,
						emailVerified: true,
					},
					omit: { password: true },
				})
			: null;

	if (!verifiedUser) {
		throw new Error("User registration data not found");
	}

	await redisClient.del(userRegistrationKey);

	const templatePath = path.join(
		process.cwd(),
		"src/templates/welcome-email.ejs",
	);

	const templateData = {
		name: verifiedUser.name,
	};

	const html = await ejs.renderFile(templatePath, templateData);

	await transporter.sendMail({
		from: config.email_sender,
		to: email,
		subject: "Welcome To Emergency Management System",
		// text : `Your OTP is ${otp}`
		// html: `<h1>Your OTP is ${otp}</h1>`
		html,
	});

	const jwtPayload = {
		userId: verifiedUser.id,
		name: verifiedUser.name,
		email: verifiedUser.email,
		role: verifiedUser.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		user: verifiedUser,
		accessToken,
		refreshToken,
	};
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
	if (user.status === UserStatus.SUSPENDED) {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"User is suspended, please contact support",
		);
	}

	if (user.isDeleted) {
		throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
	}

	const isPasswordValid = await argon2.verify(user.password, password);

	if (!isPasswordValid) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Invalid password");
	}

	if (!user.emailVerified) {
		await sendEmailVerificationOtp({
			name: user.name,
			email,
		});
		return { verificationRequired: true as const };
	}

	//!  jwt token generation
	const jwtPayload = {
		userId: user.id,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			role: user.role,
			status: user.status,
			mustChangePassword: user.mustChangePassword,
		},
	};
};

//! current user
const getMe = async (user: IRequestUser) => {
	const isUserExists = await prisma.user.findUnique({
		where: {
			id: user.userId,
		},

		omit: {
			password: true,
		},
	});

	if (!isUserExists) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	return isUserExists;
};

//! refresh token
const refreshToken = async (token: string) => {
	const verifiedRefreshToken = jwtUtils.verifyToken(
		token,
		config.jwt_refresh_secret,
	);

	if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			config.node_env === "development"
				? verifiedRefreshToken.error
				: "Invalid refresh token",
		);
	}

	const data = verifiedRefreshToken.data as JwtPayload;

	const user = await prisma.user.findUnique({
		where: { id: data.userId },
	});

	if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"User is inactive or not found",
		);
	}

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
	};
};

const forgotPassword = async (payload: IForgotPasswordPayload) => {
	const email = normalizeEmail(payload.email);

	if (!email) {
		throw new Error("Email is required");
	}

	const isUserExist = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (!isUserExist) {
		throw new Error("User Does Not Exist!");
	}

	if (isUserExist.status === "SUSPENDED") {
		throw new Error("User is Suspended, please contact support");
	}

	if (!isUserExist.emailVerified) {
		throw new Error("User Not Verified");
	}

	if (isUserExist.isDeleted) {
		throw new Error("User is Deleted");
	}

	const otp = crypto.randomInt(100000, 1000000).toString();

	if (config.node_env === "development")
		console.log(`[dev] Forgot-password OTP for ${email}: ${otp}`);

	const key = `forgot-password-otp:${isUserExist.email}`;

	const expirationSeconds = 5 * 60;

	await redisClient.set(key, otp, {
		expiration: {
			type: "EX",
			value: expirationSeconds,
		},
	});

	const templatePath = path.join(
		process.cwd(),
		"src/templates/forgot-password.ejs",
	);

	const templateData = {
		name: isUserExist.name,
		otp,
		expirationMinutes: expirationSeconds / 60,
	};

	const html = await ejs.renderFile(templatePath, templateData);

	await transporter.sendMail({
		from: config.email_sender,
		to: isUserExist.email,
		subject: "Forgot Password",
		// text : `Your OTP is ${otp}`
		// html: `<h1>Your OTP is ${otp}</h1>`
		html,
	});
};

const resetPassword = async (payload: IResetPasswordPayload) => {
	const email = payload.email?.trim().toLowerCase();
	const otp = payload.otp?.trim();
	const newPassword = payload.newPassword;

	if (!email || !otp || !newPassword) {
		throw new Error("Email, OTP and new password are required");
	}

	if (newPassword.length < 8) {
		throw new Error("Password must be at least 8 characters");
	}

	const isUserExist = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	if (!isUserExist) {
		throw new Error("User Does Not Exist!");
	}

	if (isUserExist.status === "SUSPENDED") {
		throw new Error("User is Suspended, please contact support");
	}

	if (!isUserExist.emailVerified) {
		throw new Error("User Not Verified");
	}

	if (isUserExist.isDeleted) {
		throw new Error("User is Deleted");
	}

	const key = `forgot-password-otp:${isUserExist.email}`;

	const redisOtp = await redisClient.get(key);

	if (!redisOtp) {
		throw new Error("Invalid OTP");
	}

	if (redisOtp !== otp) {
		throw new Error("OTP Does Not Match");
	}

	const hashedNewPassword = await argon2.hash(newPassword);
	await prisma.user.update({
		where: {
			email: isUserExist.email,
		},
		data: {
			password: hashedNewPassword,
		},
	});

	await redisClient.del([key]);

	const templatePath = path.join(
		process.cwd(),
		"src/templates/reset-password-success.ejs",
	);

	const templateData = {
		name: isUserExist.name,
	};

	const html = await ejs.renderFile(templatePath, templateData);

	await transporter.sendMail({
		from: config.email_sender,
		to: isUserExist.email,
		subject: "Password Changed",
		// text : `Your OTP is ${otp}`
		// html: `<h1>Your Password Is Changed</h1>`
		html,
	});
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
		if (user.status === UserStatus.SUSPENDED) {
			throw new AppError(
				httpStatus.FORBIDDEN,
				"User is suspended, please contact support",
			);
		}

		if (user.isDeleted) {
			throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
		}
		if (user.emailVerified) {
			throw new AppError(httpStatus.CONFLICT, "User already exists");
		}

		await sendEmailVerificationOtp({
			name: user.name,
			email: user.email,
		});

		return;
	}
};

// ! change password
const changePassword = async (
	user: IRequestUser,
	payload: IChangePasswordPayload,
) => {
	const { oldPassword, newPassword, confirmNewPassword } = payload;

	if (newPassword !== confirmNewPassword) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"New password and confirm new password do not match",
		);
	}

	const existingUser = await prisma.user.findUnique({
		where: { id: user.userId },
	});

	if (!existingUser) {
		throw new AppError(httpStatus.NOT_FOUND, "User not found");
	}

	const isOldPasswordValid = await argon2.verify(
		existingUser.password,
		oldPassword,
	);

	if (!isOldPasswordValid) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
	}

	const isSamePassword = await argon2.verify(
		existingUser.password,
		newPassword,
	);

	if (isSamePassword) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"New password must be different from the old password",
		);
	}

	const hashedNewPassword = await argon2.hash(newPassword);

	await prisma.user.update({
		where: { id: user.userId },
		data: {
			password: hashedNewPassword,
			mustChangePassword: false,
		},
	});

	try {
		const templatePath = path.join(
			process.cwd(),
			"src/templates/change-password-success.ejs",
		);

		const html = await ejs.renderFile(templatePath, {
			name: existingUser.name,
		});

		await transporter.sendMail({
			from: config.email_sender,
			to: existingUser.email,
			subject: "Your Password Was Changed",
			html,
		});
	} catch (error) {
		// Password is already changed.
		// Email failure must not undo the password change.
		console.error("Password change notification email failed:", error);
	}
};

export const authService = {
	registerUser,
	loginUser,
	getMe,
	refreshToken,
	verifyUserEmail,
	forgotPassword,
	resetPassword,
	changePassword,
};
