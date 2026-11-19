import { prisma } from "../../lib/prisma";
import { generatePassword } from "../../utils/generate-password";
import { CreateDispatcherInput } from "./admin.interface";
import config from "../../config";
import { transporter } from "../../lib/nodeMailer";
import ejs from "ejs";
import path from "node:path";

import argon2 from "argon2";

const sendDispatcherCredentials = async ({
	email,
	name,
	temporaryPassword,
}: {
	email: string;
	name: string;
	temporaryPassword: string;
}) => {
	const templatePath = path.join(
		process.cwd(),
		"src/templates/dispatcher-credentials.ejs",
	);
	const html = await ejs.renderFile(templatePath, {
		name,
		email,
		temporaryPassword,
	});

	await transporter.sendMail({
		from: config.email_sender,
		to: email,
		subject: "Your Dispatcher Account Credentials",
		html,
	});
};

const createDispatcher = async (payload: CreateDispatcherInput) => {
	const { name, email, phone } = payload;
	const normalizedEmail = email.trim().toLowerCase();

	// Check existing email
	const existingUser = await prisma.user.findUnique({
		where: { email: normalizedEmail },
	});

	if (existingUser) {
		throw new Error("Email already exists");
	}

	// Generate temporary password
	const temporaryPassword = generatePassword();

	// Hash password
	const hashedPassword = await argon2.hash(temporaryPassword);

	// Create dispatcher account
	const dispatcher = await prisma.user.create({
		data: {
			name,
			email: normalizedEmail,
			phone,
			password: hashedPassword,
			role: "DISPATCHER",
			emailVerified: true,
			status: "ACTIVE",
			mustChangePassword: true,
		},
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			role: true,
			status: true,
			mustChangePassword: true,
			createdAt: true,
		},
	});

	// Send credentials
	try {
		await sendDispatcherCredentials({
			email,
			name,
			temporaryPassword,
		});
	} catch (error) {
		// Avoid leaving an account whose credentials were not delivered.
		await prisma.user.delete({
			where: { id: dispatcher.id },
		});

		throw new Error("Failed to send dispatcher credentials");
	}

	return dispatcher;
};

export const DispatcherService = {
	createDispatcher,
};
