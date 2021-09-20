import {
  Table,
  Column,
  DataType,
  ForeignKey,
  PrimaryKey,
  Model,
  Default,
  AllowNull,
  BelongsToMany,
} from "sequelize-typescript";
import CartUser from "./CartUser.schema";
import User from "./User.schema";

@Table({ charset: "utf8mb4", collate: "utf8mb4_general_ci" })
export default class Cart extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  title: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  description: string;

  @BelongsToMany(() => User, () => CartUser)
  users: User[];
}
