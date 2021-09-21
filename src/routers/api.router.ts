import Router from "koa-router";
import itemRouter from "./item.router";
import userRouter from "./user.router";

const apiRouter = new Router();

apiRouter.use("/user", userRouter.routes());
apiRouter.use("/item", itemRouter.routes());

export default apiRouter;
