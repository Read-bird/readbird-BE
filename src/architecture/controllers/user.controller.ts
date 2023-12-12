import { Request, Response } from "express";
import userService from "../services/user.service";
import jwtUtil from "../../jwt/jwt-util";
import redis from "../../redis";

const signInKakao = async (req: Request, res: Response) => {
    const headers = req.headers["authorization"];
    const kakaoToken: any = headers?.split("Bearer ")[1];

    const userData: any = await userService.signInKakao(kakaoToken);

    //사용자 정보를 받아 토큰 발급
    const accesstoken = jwtUtil.sign(userData);
    const refreshToken = jwtUtil.refresh();

    //redis DB에 refreshToken을 저장
    await redis.redisCli.set(userData.email, refreshToken);
    console.log(
        "\nrefreshToken redis 저장 완료 ::: " +
            JSON.stringify(await redis.redisCli.get(userData.email)),
    );

    return res.status(200).json({
        email: userData.email,
        nickName: userData.nickName,
        imageUrl: userData.imageUrl,
        accesstoken: accesstoken,
        refreshToken: refreshToken,
    });
};

export default {
    signInKakao,
};
