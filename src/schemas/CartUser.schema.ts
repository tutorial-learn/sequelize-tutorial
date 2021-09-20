import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Cart from "./Cart.schema";
import User from "./User.schema";

@Table({ charset: "utf8mb4", collate: "utf8mb4_general_ci" })
export default class CartUser extends Model {
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @ForeignKey(() => Cart)
  @Column(DataType.UUID)
  cartId: string;
}
