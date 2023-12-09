import * as dotenv from "dotenv";
import { Options } from "sequelize/types";

dotenv.config();
const env = process.env;

export const development: Options = {
  username: env.MYSQL_USERNAME || "root",
  password: env.MYSQL_PASSWORD,
  database: env.MYSQL_DATABASE || "gongcdb",
  host: env.MYSQL_HOST || "localhost",
  dialect: "mysql",
  port: 3306,
};
