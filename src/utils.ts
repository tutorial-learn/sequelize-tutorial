import crypto from "crypto";

export const generateHash = (password: string) =>
  crypto.createHash("sha512").update(password).digest("hex");
