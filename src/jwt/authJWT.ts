import { Request, Response, NextFunction } from "express";
import jwtUtil from "./jwt-util";

export const authJWT = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split("Bearer ")[1];

        //"Bearer "가 포함되지 않았을 때
        if (!token) {
            return res
                .status(401)
                .send("Unauthorized: 유저의 토큰이 유효하지 않습니다.");
        }

        //accessToken 검증
        const result = jwtUtil.verify(token);

        //accessToken이 유효하면 result:{"ok":true, "userId": userId} 반환
        if (result.ok) {
            req.body = result.userId;
            next();
        } else {
            return res
                .status(412)
                .send(
                    "Precondition Failed: accessToken이 만료 되었습니다. 토큰 갱신이 필요합니다.",
                );
        }
    }
};

export default authJWT;
