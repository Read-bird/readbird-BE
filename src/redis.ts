require("dotenv").config();
import { createClient } from "redis";

const redisClient = createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
    legacyMode: true,
});
redisClient.on("connect", () => {
    console.info("Redis connected!");
});
redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
});
redisClient.connect().then();
const redisCli = redisClient.v4;
// const REDIS_PORT: any = process.env.REDIS_PORT;

// const redisClient = redis.createClient(REDIS_PORT);

export default {
    redisClient,
    redisCli,
};
