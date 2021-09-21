import Router from "koa-router";
import {
  addItem,
  getItem,
  getAllItem,
  editItem,
  deleteItem,
} from "../controllers/item.controller";
import { privatePath } from "../middlewares";

const itemRouter = new Router();

// 조회
itemRouter.get("/all", privatePath, getAllItem);
itemRouter.get("/:id", privatePath, getItem);

// 생성
itemRouter.post("/add", privatePath, addItem);

// 수정
itemRouter.post("/:id/edit", privatePath, editItem);

// 삭제
itemRouter.post("/:id/delete", privatePath, deleteItem);

export default itemRouter;
