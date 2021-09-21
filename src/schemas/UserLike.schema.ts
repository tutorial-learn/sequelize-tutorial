import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import Like from "./LIke.schema";
import User from "./User.schema";

@Table({ charset: "utf8", collate: "utf8_unicode_ci" })
export default class UserLIke extends Model {
  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @ForeignKey(() => Like)
  @Column(DataType.UUID)
  likeId: string;
}
