import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import jwtUtil from "../../jwt/jwt-util";
import redis from "../../redis";

const signInKakao = async (req: Request, res: Response) => {
    const headers = req.headers["authorization"];
    const kakaoToken: any = headers?.split("Bearer ")[1];

    if (!kakaoToken) {
        return res
            .status(401)
            .send("Unauthorized: 유저의 토큰이 유효하지 않습니다.");
    }
    const userData: any = await userService.signInKakao(kakaoToken);

    //userData에서 받오는 값이 false일 경우
    if (!userData) res.status(500).send("Server Error: 서버 오류");

    //사용자 정보를 받아 토큰 발급
    const accesstoken = jwtUtil.sign(userData);
    const refreshToken = jwtUtil.refresh();

    //redis key값은 String 값만 넣을 수 있음, userId는 Number 값이기 때문에 형 변환
    const userId: String = userData.userId.toString();

    //redis DB에 refreshToken을 저장
    await redis.redisCli.set(userId, refreshToken);

    return res
        .header("accesstoken", "Bearer " + accesstoken)
        .status(200)
        .json({
            userId: userData.userId,
            email: userData.email,
            nickName: userData.nickName,
            imageUrl: userData.imageUrl,
        });
};

const signInGuest = async (
    requset: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const userData: any = await userService.findGuestData();

        const accessToken = jwtUtil.sign(userData);
        const refreshToken = jwtUtil.refresh();

        await redis.redisCli.set("1", refreshToken);

        return response
            .header("accessToken", "Bearer " + accessToken)
            .status(200)
            .json({
                userId: userData.userId,
                email: userData.email,
                nickName: userData.nickName,
                imageUrl: userData.imageUrl,
            });
    } catch (error) {
        next(error);
    }
};

export default {
    signInKakao,
    signInGuest,
};
