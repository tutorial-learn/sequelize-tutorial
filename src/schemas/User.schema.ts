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
  AfterCreate,
  AfterUpdate,
} from "sequelize-typescript";
import Avatar from "./Avatar.schema";
import Item from "./Item.schema";
import ItemUser from "./ItemUser.schema";
import Like from "./LIke.schema";
import UserLIke from "./UserLike.schema";

@Table({ charset: "utf8", collate: "utf8_unicode_ci" })
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

  @HasMany(() => Item)
  uploadItems: Item[];

  @BelongsToMany(() => Item, () => ItemUser)
  carts: Item[];

  @BelongsToMany(() => Like, () => UserLIke)
  likes: Like[];

  @AfterCreate
  @AfterUpdate
  static afterProcess(instance) {
    delete instance.dataValues.password;
  }
}
