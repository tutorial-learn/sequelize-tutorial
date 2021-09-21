import Router from "koa-router";
import {
  editAccount,
  getMyInfo,
  login,
  signup,
} from "../controllers/user.controller";
import { privatePath } from "../middlewares";

const userRouter = new Router();

// 로그인
userRouter.post("/signup", signup);
userRouter.post("/login", login);

// 정보 수정
userRouter.post("/edit", privatePath, editAccount);

// 내 정보 불러오기
userRouter.get("/me", privatePath, getMyInfo);

export default userRouter;
