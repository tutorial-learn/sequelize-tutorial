import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import Cart from "./Cart.schema";
import CartLike from "./CartLike.schema";
import User from "./User.schema";
import UserLIke from "./UserLike.schema";

@Table({ charset: "utf8mb4", collate: "utf8mb4_general_ci" })
export default class Like extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @BelongsToMany(() => User, () => UserLIke)
  users: User[];

  @BelongsToMany(() => Cart, () => CartLike)
  carts: Cart[];
}
