import jwt from "jsonwebtoken";
import { Context, Next } from "koa";
import User from "./schemas/User.schema";

const JWT_SECRET = process.env.JWT_SECRET || "development";

export const generateToken = (payload: any) => jwt.sign(payload, JWT_SECRET);

export const varifyToken = (token: string) => jwt.verify(token, JWT_SECRET);

export const auth = async (ctx: Context, next: Next) => {
  const token = ctx.request.header.token;
  try {
    if (token) {
      const decode: any = varifyToken(token as string);
      const user: any = await User.findByPk(decode.id);
      ctx.user = user;
    } else {
      ctx.user = null;
    }
  } catch (error) {
    console.log(error);
  } finally {
    return next();
  }
};
