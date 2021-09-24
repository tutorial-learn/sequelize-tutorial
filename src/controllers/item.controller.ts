import { Context } from "koa";
import Joi from "joi";
import Web3 from "web3";
import CounterAbi from "../abis/Counter";

import Item from "../schemas/Item.schema";
import User from "../schemas/User.schema";
import ItemUser from "../schemas/ItemUser.schema";
import Like from "../schemas/LIke.schema";

export const addItem = async (ctx: Context) => {
  const { title, description, price } = ctx.request.body;
  const user = ctx.user;

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
    }).then((item) => item.$set("author", user));

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
    const allItem = await Item.findAll();

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
      where: { id, authorId: user.dataValues.id },
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
    const verifyOwnItem = await Item.findOne({
      where: { id },
      include: {
        model: User,
        where: { id: user.dataValues.id },
        required: true,
        attributes: [],
      },
    });

    if (!verifyOwnItem) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: "This Item is not yours",
      };
      return;
    }

    const deleteItem = await Item.destroy({ where: { id: verifyOwnItem.id } });

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
    const verifyOwnItem = await Item.findOne({
      where: { id, authorId: user.dataValues.id },
    });

    if (!verifyOwnItem) {
      ctx.status = 401;
      ctx.body = {
        success: false,
        message: "This Item is not yours",
      };
      return;
    }

    const updataItem = await Item.update(
      { title, description, price },
      { where: { id: verifyOwnItem.id } }
    );

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: null,
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
    const findItem = await Item.findOne({ where: { id } });

    await User.findByPk(user.id, {
      attributes: { include: ["id"] },
    }).then((user) => {
      user.$add("carts", findItem);
      return user;
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: null,
    };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: e.masseage,
    };
  }
};

export const getAllCart = async (ctx: Context) => {
  const user = ctx.user;

  try {
    const myCarts = await User.findOne({
      where: { id: user.id },
      attributes: [],
      include: {
        model: Item,
        as: "carts",
      },
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: myCarts.carts,
    };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: e.message,
    };
  }
};

export const getOneCart = async (ctx: Context) => {
  const user = ctx.user;
  const { id } = ctx.params;

  try {
    const findItem = await Item.findOne({
      where: { id },
      include: {
        model: User,
        as: "selectedByUsers",
        where: { id: user.id },
        attributes: [],
      },
    });

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: findItem,
    };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: e.message,
    };
  }
};

// pending...
export const buyItem = async (ctx: Context) => {
  const user = ctx.user;
  const { id } = ctx.params;
  const willBuyItem = await Item.findOne({ where: { id: id } });

  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://localhost:8545")
  );

  // Smart Contract thing...
  if (willBuyItem) {
    const contract = new web3.eth.Contract(
      CounterAbi,
      "0x1fa84aa80D7cc9A27d8C5d30A74A33217537Bba7"
    );

    await contract.methods.incrementCount().call();
    setTimeout(async () => {
      const result = await contract.methods.getCount().call();
      console.log(result);
    }, 10000);
  }
};

export const toggleLike = async (ctx: Context) => {
  const user = ctx.user;
  const { id } = ctx.params;

  try {
    const selectItem = await Item.findOne({ where: { id } });
    const isLiked = await Like.findOne({
      include: [
        { model: User, where: { id: user.id } },
        { model: Item, where: { id } },
      ],
    });
    if (!isLiked) {
      await Like.create({}).then((like) => {
        like.$add("users", user);
        like.$add("items", selectItem);
      });
    } else {
      await Like.destroy({ where: { id: isLiked.id } });
    }

    ctx.status = 200;
    ctx.body = {
      success: true,
      data: null,
    };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      message: e.message,
    };
  }
};
