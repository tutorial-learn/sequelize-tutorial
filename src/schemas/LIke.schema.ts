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
import Item from "./Item.schema";
import ItemLike from "./ItemLike.schema";
import User from "./User.schema";
import UserLIke from "./UserLike.schema";

@Table({ charset: "utf8", collate: "utf8_unicode_ci" })
export default class Like extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @BelongsToMany(() => User, () => UserLIke)
  users: User[];

  @BelongsToMany(() => Item, () => ItemLike)
  items: Item[];
}
