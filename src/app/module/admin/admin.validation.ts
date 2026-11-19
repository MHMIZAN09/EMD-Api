// export interface CreateDispatcherInput {
//   name: string;
//   email: string;
//   phone: string;
// }

import z from "zod";

const createDispatcherSchema = z.object({
  name: z.string("Name is required").min(3, "Name is required"),
  email: z.email("Email is required").includes("@", "Email must be valid"),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
});

export const adminValidation = {
  createDispatcherSchema,
};
