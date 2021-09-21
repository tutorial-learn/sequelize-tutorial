import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Item from "./Item.schema";
import User from "./User.schema";

@Table({ charset: "utf8", collate: "utf8_unicode_ci" })
export default class ItemUser extends Model {
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @ForeignKey(() => Item)
  @Column(DataType.UUID)
  itemId: string;
}
