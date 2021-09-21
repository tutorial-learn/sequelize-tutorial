import Koa from "koa";
import Router from "koa-router";
import helmet from "koa-helmet";
import logger from "koa-morgan";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "koa-bodyparser";
import apiRouter from "./routers/api.router";
import { checkAuth } from "./middlewares";
import "./db";

dotenv.config({
  path: path.resolve(
    __dirname,
    process.env.NODE_ENV === "development"
      ? "../.env.development"
      : "../.env.production"
  ),
});

const PORT = process.env.PORT || 3000;

const app = new Koa();
const globalRouter = new Router();

app.use(helmet());
app.use(bodyParser());
app.use(logger("dev"));

globalRouter.use("/api", checkAuth, apiRouter.routes());

app.use(globalRouter.routes()).use(globalRouter.allowedMethods());

const start = async () => {
  app.listen(PORT, () => {
    console.log(`Server listening -- http://localhost:${PORT}/`);
  });
};

start();
