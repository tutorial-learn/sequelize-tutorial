import { Sequelize } from "sequelize-typescript";
import { Sequelize as OriginalSequelize } from "sequelize";
import cls from "cls-hooked";

const namespace = cls.createNamespace("sequelize-ns");
OriginalSequelize.useCLS(namespace);

const db = new Sequelize({
  database: "for_koa",
  password: "wns2dp5",
  username: "juno",
  host: "localhost",
  dialect: "mysql",
  port: 3306,
  models: [`${__dirname}/schemas/*.schema.ts`],
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: true,
  },
  logging: false,
});

(async () => {
  await db.sync({ alter: true, force: false });
})();

export default db;
