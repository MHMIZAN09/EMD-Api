import { z } from "zod";

const userUpdateSchema = z.object({
  name: z.string("Name is required").optional(),
  phone: z.string("Phone is required").optional(),
});

export const userValidation = {
  userUpdateSchema,
};
