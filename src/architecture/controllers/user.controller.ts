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

const findPlanByDelete = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    //  #swagger.description = '삭제 된 플랜을 조회할 수 있습니다.'
    //  #swagger.tags = ['MyPage']
    /* #swagger.parameters['Authorization'] = {
        in: "header",                            
        description: "Authorization",                   
        required: true,                     
        type: "string"         
    } */
    /*  #swagger.responses[200] = {
        description: '조회 성공',
        schema: {
            "planId": 1,
            "startDate": "2023-12-11T15:00:00.000Z",
            "endDate": "2023-12-13T00:00:00.000Z",
            "totalPage": 100,
            "currentPage": 30,
            "Book.bookId": 1,
            "Book.title": "제3인류 1",
            "Book.author": "베르나르 베르베르 지음, 이세욱 옮김",
            "Book.description": "베르나르 베르베르 특유의 상상력으로 축조한 장대한 스케일의 과학 소설. 남극. 저명한 고생물학자 샤를 웰즈의 탐사대가 17미터에 달하는 거인의 유골들을 발굴한다. 그러나 인류사를 다시 쓰게 만들 이 중대한 발견은 발굴 현장의 사고와 함께 곧바로 파묻히고 마는데…",
            "Book.coverImage": "http://image.aladin.co.kr/product/3213/68/coversum/8932916373_2.jpg",
            "Book.isbn": "8932916373"
        }
    }*/
    try {
        const { userId } = request.body;

        const findPlanByDelete = await userService.findPlanByDelete(userId);

        response.status(200).json(findPlanByDelete);
    } catch (error) {
        next(error);
    }
};

export default {
    signInKakao,
    signInGuest,
    deleteAllPlan,
    findPlanByDelete,
};
