import Router from "koa-router";
import {
  addItem,
  getItem,
  getAllItem,
  editItem,
  deleteItem,
  buyItem,
  addCart,
  getAllCart,
  getOneCart,
  toggleLike,
} from "../controllers/item.controller";
import { privatePath } from "../middlewares";

const itemRouter = new Router();

// 조회
itemRouter.get("/all", privatePath, getAllItem);
itemRouter.get("/:id", privatePath, getItem);

// 생성
itemRouter.post("/add", privatePath, addItem);

// 수정
itemRouter.post("/edit/:id", privatePath, editItem);

// 삭제
itemRouter.post("/delete/:id", privatePath, deleteItem);

// 장바구니 담기
itemRouter.post("/addcart/:id", privatePath, addCart);

// 장바구니 가져오기
itemRouter.get("/getcart/all", privatePath, getAllCart);
itemRouter.get("/getcart/:id", privatePath, getOneCart);

// 아이템 사기(Contract)
itemRouter.post("/buy/:id", privatePath, buyItem);

// 좋아요
itemRouter.post("/like/:id", privatePath, toggleLike);

export default itemRouter;
