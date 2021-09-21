import { Context } from "koa";
import bcrypt from "bcrypt";
import Joi from "joi";

import User from "../schemas/User.schema";
import Avatar from "../schemas/Avatar.schema";

import { generateHash, generateToken } from "../utils";
import Item from "../schemas/Item.schema";

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
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: "Incorrect input type",
    };
    return;
  }

  const hashedPassword = generateHash(password);

  try {
    const { email, username } = result.value;
    const newUser = await User.create(
      {
        email,
        username,
        password: hashedPassword,
        avatar: {
          url: "",
        },
      },
      { include: Avatar }
    );

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: newUser,
    };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: e.message,
    };
  }
  return;
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
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: "Incorrect input type",
    };
    return;
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
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: e.message,
    };
  }
  return;
};

export const editAccount = async (ctx: Context) => {
  const userInfo = ctx.user;
  const { username, url } = ctx.request.body;

  try {
    await User.update({ username }, { where: { id: userInfo.id } });

    await Avatar.update({ url }, { where: { userId: userInfo.id } });

    ctx.status = 200;
    ctx.body = {
      success: true,
    };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: e.message,
    };
  }
};

export const getMyInfo = async (ctx: Context) => {
  const userInfo = ctx.user;

  try {
    const getUserInfo = await User.findOne({
      where: { id: userInfo.id },
      include: [{ model: Item }, { model: Avatar }],
      attributes: ["username, avatar, carts, items"],
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: getUserInfo,
    };
  } catch (e) {
    ctx.status = 500;
    ctx.data = {
      success: false,
      message: e.masseage,
    };
  }
};
