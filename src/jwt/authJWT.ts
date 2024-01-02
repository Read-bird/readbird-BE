import { Request, Response, NextFunction } from "express";
import jwtUtil from "./jwt-util";
import userRepository from "../architecture/repositories/user.repository";

export const authJWT = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split("Bearer ")[1];

            //"Bearer "가 포함되지 않았을 때
            if (!token) {
                return res
                    .status(401)
                    .send("Unauthorized: 유저의 토큰이 유효하지 않습니다");
            }

            //accessToken 검증
            const result = jwtUtil.verify(token);

            if (result.userId != 1) {
                //userId로 imageUrl 조회하여 탈퇴한 회원인지 확인
                const data: any = await userRepository.getUserByImageUrl(
                    result.userId,
                );

                if (data.imageUrl === "delete") {
                    return res
                        .status(401)
                        .send("Unauthorized: 탈퇴한 회원 입니다.");
                }
            }

            //accessToken이 유효하면 result:{"ok":true, "userId": userId} 반환
            if (result.ok) {
                req.body.userId = result.userId;
                next();
            } else {
                return res
                    .status(412)
                    .send(
                        "Precondition Failed: accessToken이 만료 되었습니다. 토큰 갱신이 필요합니다.",
                    );
            }
        } else if (req.headers.authorization == null) {
            return res
                .status(400)
                .send("Bad Request: 토큰이 존재하지 않습니다.");
        }
    } catch (error) {
        next(error);
    }
};

export default authJWT;
