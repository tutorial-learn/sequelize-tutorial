import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "development";

export const generateHash = (password: string) =>
  crypto.createHash("sha512").update(password).digest("hex");

export const generateToken = (payload: any) => jwt.sign(payload, JWT_SECRET);

export const varifyToken = (token: string) => jwt.verify(token, JWT_SECRET);
