import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import argon2 from "argon2";
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
  //! admin seeding
  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPassword = process.env.ADMIN_PASSWORD!;
  const adminName = process.env.ADMIN_NAME!;
  const adminPhone = process.env.ADMIN_PHONE!;

  const hashedPassword = await argon2.hash(adminPassword);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      phone: adminPhone,
      role: "ADMIN",
      status: "ACTIVE",
      emailVerified: true,
    },
  });

  console.log("Admin user seeded:", admin);

  //! dispatcher seeding
  const dispatcherEmail = process.env.DISPATCHER_EMAIL!;
  const dispatcherPassword = process.env.DISPATCHER_PASSWORD!;
  const dispatcherName = process.env.DISPATCHER_NAME!;
  const dispatcherPhone = process.env.DISPATCHER_PHONE!;

  const hashedDispatcherPassword = await argon2.hash(dispatcherPassword);

  const dispatcher = await prisma.user.upsert({
    where: { email: dispatcherEmail },
    update: {},
    create: {
      name: dispatcherName,
      email: dispatcherEmail,
      password: hashedDispatcherPassword,
      phone: dispatcherPhone,
      role: "DISPATCHER",
      status: "ACTIVE",
      emailVerified: true,
    },
  });

  console.log("Dispatcher user seeded:", dispatcher);

  //! requester seeding
  const requesterEmail = process.env.REQUESTER_EMAIL!;
  const requesterPassword = process.env.REQUESTER_PASSWORD!;
  const requesterName = process.env.REQUESTER_NAME!;
  const requesterPhone = process.env.REQUESTER_PHONE!;

  const hashedRequesterPassword = await argon2.hash(requesterPassword);

  const requester = await prisma.user.upsert({
    where: { email: requesterEmail },
    update: {},
    create: {
      name: requesterName,
      email: requesterEmail,
      password: hashedRequesterPassword,
      phone: requesterPhone,
      role: "REQUESTER",
      status: "ACTIVE",
      emailVerified: true,
    },
  });

  console.log("Requester user seeded:", requester);
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
