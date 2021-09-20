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
  dialectOptions: {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    timezone: "+00:00",
  },
});

(async () => {
  await db.sync({ alter: true, force: false });
})();

export default db;
