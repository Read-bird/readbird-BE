require("dotenv").config();
import { createClient } from "redis";

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
    legacyMode: true,
});
// const redisClient = createClient({
//     url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
//     legacyMode: true,
// });
redisClient.on("connect", () => {
    console.info("Redis connected!");
});
// redisClient.on("error", (err) => {
//     console.error("Redis Client Error", err);
// });
// redisClient.connect().then();
redisClient.connect().catch(console.error);
const redisCli = redisClient.v4;

export default {
    redisClient,
    redisCli,
};
