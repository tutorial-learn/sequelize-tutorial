import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Item from "./Item.schema";
import Like from "./LIke.schema";

@Table({ charset: "utf8", collate: "utf8_unicode_ci" })
export default class ItemLike extends Model {
  @ForeignKey(() => Item)
  @Column(DataType.UUID)
  itemId: string;

  @ForeignKey(() => Like)
  @Column(DataType.UUID)
  likeId: string;
}
