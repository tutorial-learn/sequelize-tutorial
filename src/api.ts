import Router from "koa-router";
import { addCart, getCart, getCarts } from "./controllers/cart.controller";
import { login, signup } from "./controllers/user.controller";
import { auth } from "./jwt";

const apiRouter = new Router();

apiRouter.post("/signup", signup);
apiRouter.post("/login", login);

apiRouter.post("/addcart", auth, addCart);

apiRouter.get("/getcarts", auth, getCarts);
apiRouter.get("/getcart/:id", auth, getCart);

export default apiRouter;
