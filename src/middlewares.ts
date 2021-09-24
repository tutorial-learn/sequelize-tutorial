import { Context, Next } from "koa";
import User from "./schemas/User.schema";
import { varifyToken } from "./utils";

export const checkAuth = async (ctx: Context, next: Next) => {
  const token = ctx.request.header.token;
  try {
    if (token) {
      const decode: any = varifyToken(token as string);
      const user: any = await User.findByPk(decode.id, {
        attributes: ["id", "username", "email"],
      });
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

export const privatePath = (ctx: Context, next: Next) => {
  const user = ctx.user;
  if (user) {
    return next();
  }
  throw Error("This path is required login");
};
