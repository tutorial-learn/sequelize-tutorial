import {
  Table,
  Column,
  DataType,
  PrimaryKey,
  Model,
  Default,
  AllowNull,
  BelongsToMany,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import ItemUser from "./ItemUser.schema";
import User from "./User.schema";

@Table({ charset: "utf8", collate: "utf8_unicode_ci" })
export default class Item extends Model {
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

  @AllowNull(false)
  @Column(DataType.INTEGER)
  price: number;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  itemId: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsToMany(() => User, () => ItemUser)
  users: User[];
}
