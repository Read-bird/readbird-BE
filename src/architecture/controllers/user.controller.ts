import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import jwtUtil from "../../jwt/jwt-util";
import redis from "../../redis";

const signInKakao = async (req: Request, res: Response) => {
    //  #swagger.description = '게스트로 로그인 해 서비스를 체험해볼 수 있습니다.'
    //  #swagger.tags = ['Login']
    /* #swagger.parameters['accessToken'] = {
            in: "header",                            
            description: "accessToken",                   
            required: true,                     
            type: "string"         
        } */
    /*  #swagger.responses[200] = {
            description: '카카오 소셜 로그인 성공',
            schema: {                
                userId: 1,
                email: "guest@readbird.com",
                nickName: "guest",
                imageUrl: "",
            }
        }*/
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
        .header({
            Authorization: "Bearer " + accesstoken,
            RefreshToken: "Bearer " + refreshToken,
        })
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
    //  #swagger.description = '게스트로 로그인 해 서비스를 체험해볼 수 있습니다.'
    //  #swagger.tags = ['Login']
    /*  #swagger.responses[200] = {
            description: '게스트 로그인 성공',
            schema: {                
                userId: 1,
                email: "guest@readbird.com",
                nickName: "guest",
                imageUrl: "",
            }
        }*/
    try {
        const userData: any = await userService.findGuestData();

        const accessToken = jwtUtil.sign(userData);
        const refreshToken = jwtUtil.refresh();

        await redis.redisCli.set("1", refreshToken);

        return response
            .header("Authorization", "Bearer " + accessToken)
            .header("RefreshToken", "Bearer " + refreshToken)
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

const deleteAllPlan = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    //  #swagger.description = '모든 플랜을 삭제합니다.'
    //  #swagger.tags = ['MyPage']
    /* #swagger.parameters['Authorization'] = {
        in: "header",                            
        description: "Authorization",                   
        required: true,                     
        type: "string"         
    } */
    /*  #swagger.responses[200] = {
        description: '삭제 성공 여부',
        schema: {
            "message": "모든 플랜을 삭제하였습니다."
        }
    }*/
    try {
        const { userId } = request.body;

        await userService.deleteAllPlan(userId);

        response.status(200).json({ message: "모든 플랜을 삭제하였습니다." });
    } catch (error) {
        next(error);
    }
};

export default {
    signInKakao,
    signInGuest,
    deleteAllPlan,
};
