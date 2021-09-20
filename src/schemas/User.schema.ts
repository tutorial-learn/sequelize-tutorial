import {
  DataType,
  AllowNull,
  BelongsToMany,
  Column,
  Default,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from "sequelize-typescript";
import Avatar from "./Avatar.schema";
import Cart from "./Cart.schema";
import CartUser from "./CartUser.schema";
import Like from "./LIke.schema";
import UserLIke from "./UserLike.schema";

@Table({ charset: "utf8mb4", collate: "utf8mb4_general_ci" })
export default class User extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Unique
  @AllowNull(true)
  @Column(DataType.STRING)
  username: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  password: string;

  @HasOne(() => Avatar)
  avatar: Avatar;

  @BelongsToMany(() => Cart, () => CartUser)
  carts: Cart[];

  @BelongsToMany(() => Like, () => UserLIke)
  likes: Like[];
}
