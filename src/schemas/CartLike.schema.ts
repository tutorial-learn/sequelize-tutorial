import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Cart from "./Cart.schema";
import Like from "./LIke.schema";

@Table({ charset: "utf8mb4", collate: "utf8mb4_general_ci" })
export default class CartLike extends Model {
  @ForeignKey(() => Cart)
  @Column(DataType.UUID)
  cartId: string;

  @ForeignKey(() => Like)
  @Column(DataType.UUID)
  likeId: string;
}
