require("dotenv").config();
import { promisify } from "util";
import jwt from "jsonwebtoken";
import redis from "../redis";

const secretKey: any = process.env.SECRETKEY;
const algorithm: any = process.env.ALGORITHM;

export default {
    sign: (userData: any) => {
        const payload = {
            userId: userData.userId,
        };

        return jwt.sign(payload, secretKey, {
            algorithm: algorithm,
            expiresIn: "10h",
        });
    },
    verify: (token: any) => {
        let decoded: any = null;
        try {
            decoded = jwt.verify(token, secretKey);
            return {
                ok: true,
                userId: decoded.userId,
            };
        } catch (error: any) {
            return {
                ok: false,
                message: error.message,
            };
        }
    },
    refresh: () => {
        return jwt.sign({}, secretKey, {
            algorithm: algorithm,
            expiresIn: "7d",
        });
    },
    refreshVerify: async (token: any, userId: String) => {
        const getAsync = promisify(redis.redisClient.get).bind(
            redis.redisClient,
        );
        try {
            const data = await getAsync(userId);
            if (token === data) {
                jwt.verify(token, secretKey);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    },
};
