import { randomBytes } from "crypto";

export const generatePassword = () => {
  return randomBytes(8).toString("base64url");
};
