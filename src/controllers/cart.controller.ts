import Joi from "joi";
import { Context } from "koa";
import Cart from "../schemas/Cart.schema";
import User from "../schemas/User.schema";

export const addCart = async (ctx: Context) => {
  const { title, description } = ctx.request.body;
  const { user } = ctx;

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
  });

  const result = schema.validate({ title, description });

  if (result.error) {
    throw Error("Incorrect input type");
  }

  try {
    const newCart: any = await Cart.create({
      title,
      description,
    });

    newCart.$add("users", user);

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: {
        id: newCart.dataValues.id,
        title: newCart.dataValues.title,
        description: newCart.dataValues.description,
      },
    };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: e.message,
    };
  }
};

export const getCarts = async (ctx: Context) => {
  const user = ctx.user;
  try {
    const allCart = await Cart.findAll({
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
      data: [...allCart],
    };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: e.message,
    };
  }
};

export const getCart = async (ctx: Context) => {
  const user = ctx.user;
  const params = ctx.params;
  try {
    const cart: any = await Cart.findOne({
      where: { id: params.id },
      include: {
        model: User,
        where: { id: user.dataValues.id },
      },
    });

    if (!cart) throw Error(`Cart not found`);

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: {
        id: cart.dataValues.id,
        title: cart.dataValues.title,
        description: cart.dataValues.description,
      },
    };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: e.message,
    };
  }
};

export const deleteCart = () => {};
