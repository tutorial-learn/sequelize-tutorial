import Joi from "joi";
import User from "../schemas/User.schema";
import { Context } from "koa";
import { generateHash } from "../utils";
import { generateToken } from "../jwt";
import bcrypt from "bcrypt";

export const signup = async (ctx: Context) => {
  const { email, username, password } = ctx.request.body;
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(10).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{5,13}$"))
      .required(),
  });

  const result = schema.validate({ email, username, password });

  if (result.error) {
    throw Error("Incorrect input type");
  }

  const hashedPassword = generateHash(password);

  try {
    const { email, username } = result.value;
    const newUser: any = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    ctx.status = 200;
    ctx.body = {
      status: 200,
      success: true,
      data: {
        email: newUser.dataValues.email,
        username: newUser.dataValues.username,
      },
    };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      status: 500,
      success: false,
      message: e.message,
    };
  }
};

export const login = async (ctx: Context) => {
  const { email, password } = ctx.request.body;
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{5,13}$"))
      .required(),
  });

  const result = schema.validate({ email, password });

  if (result.error) {
    throw Error("Incorrect input type");
  }

  const hashedPassword = generateHash(password);

  try {
    const checkUser: any = await User.findOne({
      where: { email },
    });

    if (!checkUser) throw Error(`${email} : user not found!`);

    const isCorrectPsw = bcrypt.compare(
      hashedPassword,
      checkUser.dataValues.password
    );

    if (!isCorrectPsw) throw Error("Incorrect password!");

    const token = generateToken({ id: checkUser.dataValues.id });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: {
        token,
      },
    };
  } catch (e) {
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: e.message,
    };
  }
};
