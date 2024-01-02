import * as dotenv from "dotenv";
import { Options } from "sequelize/types";
import winston from "winston";

dotenv.config();
const env = process.env;

const development: Options = {
    username: env.MYSQL_USERNAME || "root",
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE || "ReadBird",
    host: env.MYSQL_HOST,
    dialect: "mysql",
    port: 3306,
    logging: winston.debug,
};

module.exports = development;

export default development;
