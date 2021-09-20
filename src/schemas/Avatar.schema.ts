import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import User from "./User.schema";

@Table({ charset: "utf8mb4", collate: "utf8mb4_general_ci" })
export default class Avatar extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  url: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  userId: string;

  @BelongsTo(() => User, { onUpdate: "CASCADE", onDelete: "CASCADE" })
  user: User;
}
