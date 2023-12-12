import { Request, Response, NextFunction } from "express";
import jwtUtil from "./jwt-util";

const authJWT = (req: any, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split("Bearer ")[1];
        const result = jwtUtil.verify(token);
        if (result.ok) {
            req.email = result.email;
            req.nickName = result.nickName;
            req.imageUrl = result.imageUrl;
            next();
        } else {
            return res.status(412).send("accessToken이 만료 되었습니다");
        }
    }
};

export default {
    authJWT,
};
