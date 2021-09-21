import { Context } from "koa";
import Joi from "joi";

import Item from "../schemas/Item.schema";
import User from "../schemas/User.schema";

export const addItem = async (ctx: Context) => {
  const { title, description, price } = ctx.request.body;
  const { user } = ctx;

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().required(),
  });

  const result = schema.validate({ title, description, price });

  if (result.error) {
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: "Incorrect Input type",
    };
    return;
  }

  try {
    const newItem = await Item.create({
      title,
      description,
      price,
    });

    newItem.$add("users", user);

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: newItem,
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

export const getAllItem = async (ctx: Context) => {
  const user = ctx.user;
  try {
    const allItem = await Item.findAll({
      include: {
        model: User,
        where: { id: user.dataValues.id },
        required: true,
        attributes: [],
      },
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: [...allItem],
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

export const getItem = async (ctx: Context) => {
  const user = ctx.user;
  const { id } = ctx.params;
  try {
    const item: any = await Item.findOne({
      where: { id },
      include: {
        model: User,
        where: { id: user.dataValues.id },
      },
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: item,
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

export const deleteItem = async (ctx: Context) => {
  const user = ctx.user;
  const { id } = ctx.params;

  try {
    const varifyOwnItem = await Item.findOne({
      where: { id },
      include: {
        model: User,
        where: { id: user.dataValues.id },
        required: true,
        attributes: [],
      },
    });

    if (!varifyOwnItem) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: "This Item is not yours",
      };
      return;
    }

    const deleteItem = await Item.destroy({ where: { id: varifyOwnItem.id } });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: deleteItem,
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

export const editItem = async (ctx: Context) => {
  const user = ctx.user;
  const { id } = ctx.params;
  const { title, description, price } = ctx.request.body;

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number(),
  });

  const result = schema.validate({ title, description, price });

  if (result.error) {
    ctx.status = 401;
    ctx.body = {
      success: false,
      message: "Incorrect Input type",
    };
    return;
  }

  try {
    const varifyOwnItem = await Item.findOne({
      where: { id },
      include: {
        model: User,
        where: { id: user.dataValues.id },
        required: true,
        attributes: [],
      },
    });

    if (!varifyOwnItem) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: "This Item is not yours",
      };
      return;
    }

    const updataItem = await Item.update(
      { title, description, price },
      { where: { id: varifyOwnItem.id } }
    );

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: updataItem,
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

export const addCart = async (ctx: Context) => {
  const user = ctx.user;
  const { id } = ctx.params;

  try {
    const userInfo = await User.findByPk(user.id);
    const findItem = await Item.findOne({ where: { id } });

    userInfo.$add("carts", findItem);

    ctx.status = 500;
    ctx.body = {
      success: false,
      data: findItem,
    };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: e.masseage,
    };
  }
};
