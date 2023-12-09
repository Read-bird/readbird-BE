import { Sequelize } from "sequelize";
import config from "../config/config";

const sequelize = new Sequelize(
    config.database as string,
    config.username as string,
    config.password as string,
    {
        host: config.host,
        dialect: "mysql",
        timezone: "+09:00",
    },
);

export default sequelize;
