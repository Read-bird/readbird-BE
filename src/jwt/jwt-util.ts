import { promisify } from "util";
import jwt from "jsonwebtoken";
import redis from "../redis";
const secretKey: any = process.env.SECRETKEY;

export default {
    sign: (userData: any) => {
        const payload = {
            email: userData.email,
            nickName: userData.nickName,
            imageUrl: userData.imageUrl,
        };
        // console.log("\nuserData.email :: " + userData.email);
        // console.log("\nuserData.nickname :: " + userData.nickName);
        // console.log("\nuserData.imageUrl :: " + userData.imageUrl);
        return jwt.sign(payload, secretKey, {
            algorithm: "HS256",
            expiresIn: "1h",
        });
    },
    verify: (token: any) => {
        let decoded: any = null;
        try {
            decoded = jwt.verify(token, secretKey);
            return {
                ok: true,
                email: decoded.email,
                nickName: decoded.nickName,
                imageUrl: decoded.imageUrl,
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
            algorithm: "HS256",
            expiresIn: "7d",
        });
    },
    refreshVerify: async (token: any, email: String) => {
        const getAsync = promisify(redis.redisClient.get).bind(
            redis.redisClient,
        );
        try {
            const data = await getAsync(email);
            if (token === data) {
                try {
                    jwt.verify(token, secretKey);
                    return true;
                } catch (error) {
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    },
};
