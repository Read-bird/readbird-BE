import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
import jwtUtil from "../../jwt/jwt-util";
import redis from "../../redis";

const signInKakao = async (req: Request, res: Response, next: NextFunction) => {
    //  #swagger.description = '게스트로 로그인 해 서비스를 체험해볼 수 있습니다.'
    //  #swagger.tags = ['Login']
    /* #swagger.parameters['authorization'] = {
            in: "header",                            
            description: "authorization",                   
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
    try {
        const headers = req.headers["authorization"];
        const kakaoToken: any = headers?.split("Bearer ")[1];

        if (!kakaoToken) {
            return res
                .status(401)
                .send("Unauthorized: 유저의 토큰이 유효하지 않습니다.");
        }
        const userData: any = await userService.signInKakao(kakaoToken);

        //userData에서 받오는 값이 없을 경우
        if (userData == undefined) {
            return res
                .status(401)
                .send("Unauthorized: 유저의 토큰이 유효하지 않습니다.");
        }

        //사용자 정보를 받아 토큰 발급
        const accesstoken = jwtUtil.sign(userData);
        const refreshToken = jwtUtil.refresh();

        //redis key값은 String 값만 넣을 수 있음, userId는 Number 값이기 때문에 형 변환
        const userId: String = userData.userId.toString();

        //redis DB에 refreshToken을 저장
        await redis.redisCli.set(userId, refreshToken);
        if (!userData.character) {
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
        } else {
            return res
                .header({
                    Authorization: "Bearer " + accesstoken,
                    RefreshToken: "Bearer " + refreshToken,
                })
                .status(200)
                .json({
                    ...userData,
                });
        }
    } catch (error) {
        next(error);
    }
};

const signInGuest = async (
    request: Request,
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

const getPlanBySuccess = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    //  #swagger.description = '나의 서재 : 성공한 모든 플랜을 조회합니다.'
    //  #swagger.tags = ['MyPage']
    /* #swagger.parameters['Authorization'] = {
        in: "header",                            
        description: "Authorization",                   
        required: true,                     
        type: "string"         
    } */
    /* #swagger.parameters['page'] = {
            in: "query",                            
            description: "검색 할 페이지",                   
            required: false,                     
            type: "number",
            default : 1         
        } */
    /* #swagger.parameters['scale'] = {
            in: "query",                            
            description: "검색 할 도서의 개수",                   
            required: false,                     
            type: "number",
            default : 10    
        } */
    /*  #swagger.responses[200] = {
            description: '조회 성공',
            schema: [{                
                "planId": 1,
                "startDate": "2023-12-11T15:00:00.000Z",
                "endDate": "2023-12-13T00:00:00.000Z",
                "bookId": 1,
                "title": "제3인류 1",
                "author": "베르나르 베르베르 지음, 이세욱 옮김",
                "description": "베르나르 베르베르 특유의 상상력으로 축조한 장대한 스케일의 과학 소설. 남극. 저명한 고생물학자 샤를 웰즈의 탐사대가 17미터에 달하는 거인의 유골들을 발굴한다. 그러나 인류사를 다시 쓰게 만들 이 중대한 발견은 발굴 현장의 사고와 함께 곧바로 파묻히고 마는데…",
                "coverImage": "http://image.aladin.co.kr/product/3213/68/coversum/8932916373_2.jpg",
                "isbn": "8932916373"
            }]
        }*/
    try {
        const { userId } = request.body;

        let { page, scale }: any = request.query;

        if (!page || page === null) page = 1;
        if (!scale || scale === null) scale = 10;

        const getPlanBySuccess = await userService.getPlanBySuccess(
            userId,
            page,
            scale,
        );

        response.status(200).json({
            page: Number(page),
            scale: Number(scale),
            totalCount: getPlanBySuccess.totalCount,
            totalPage: getPlanBySuccess.totalPage,
            bookList: getPlanBySuccess.bookList,
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

const restorePlan = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    //  #swagger.description = '플랜을 복구 할 수 있습니다.'
    //  #swagger.tags = ['MyPage']
    /* #swagger.parameters['Authorization'] = {
        in: "header",                            
        description: "Authorization",                   
        required: true,                     
        type: "string"         
    } */
    /*  #swagger.responses[200] = {
        description: '플랜 복구 완료',
        schema: {    
            "message": "복구를 성공하였습니다."
        }
    }*/
    /*  #swagger.responses[400] = {
        description: '값이 알맞게 들어오지 않을 경우',
    }*/
    /*  #swagger.responses[404] = {
        description: '플랜을 찾을 수 없는 경우',
    }*/
    try {
        const { userId } = request.body;
        const { planId } = request.params;

        await userService.restorePlan(userId, Number(planId));

        response.status(200).json({ message: "복구를 성공하였습니다." });
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
        schema: [{
            "planId": 1,
            "startDate": "2023-12-11T15:00:00.000Z",
            "endDate": "2023-12-13T00:00:00.000Z",
            "totalPage": 100,
            "currentPage": 30,
            "bookId": 1,
            "title": "제3인류 1",
            "author": "베르나르 베르베르 지음, 이세욱 옮김",
            "description": "베르나르 베르베르 특유의 상상력으로 축조한 장대한 스케일의 과학 소설. 남극. 저명한 고생물학자 샤를 웰즈의 탐사대가 17미터에 달하는 거인의 유골들을 발굴한다. 그러나 인류사를 다시 쓰게 만들 이 중대한 발견은 발굴 현장의 사고와 함께 곧바로 파묻히고 마는데…",
            "coverImage": "http://image.aladin.co.kr/product/3213/68/coversum/8932916373_2.jpg",
            "isbn": "8932916373"
        }]
    }*/
    try {
        const { userId } = request.body;

        const findPlanByDelete = await userService.findPlanByDelete(userId);

        response.status(200).json(findPlanByDelete);
    } catch (error) {
        next(error);
    }
};

const userSecession = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    //  #swagger.description = '유저의 회원 탈퇴'
    //  #swagger.tags = ['User']
    /* #swagger.parameters['authorization'] = {
            in: "header",                            
            description: "authorization",                   
            required: true,                     
            type: "string"         
        } */
    /*  #swagger.responses[200] = {
            description: '회원 탈퇴 완료',
        }*/
    try {
        const { userId } = req.body;

        if (<number>userId === 1) {
            throw new Error(
                "Bad Request: 게스트 로그인은 회원 탈퇴를 할 수 없습니다",
            );
        }

        const result = await userService.userSecession(userId);

        if (result) {
            res.status(200).send("회원 탈퇴 완료");
        } else {
            res.status(500).send("Server Error: 서버 오류");
        }
    } catch (error) {
        next(error);
    }
};

const planValidation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    //  #swagger.description = '유저의 진행 중과 진행 예정인 플팬이 3개가 넘어가는지 검사'
    //  #swagger.tags = ['Plan']
    /* #swagger.parameters['Authorization'] = {
        in: "header",                            
        description: "Authorization",                   
        required: true,                     
        type: "string"         
    } */
    /*  #swagger.responses[200] = {
        description: '플랜이 0~2개인 경우',
        schema: {
            "planValidation": true,
        } 
    }*/
    /*  #swagger.responses[200] = {
        description: '플랜이 3개인 경우',
        schema: {
            "planValidation": false,
        } 
    }*/
    /*  #swagger.responses[401, 412] = {
        description: '유저의 정보가 올바르지 않은 경우',
    }*/
    try {
        const { userId }: number | any = req.body;

        const result: number = await userService.planValidation(<number>userId);

        if (result === undefined) throw new Error();

        if (0 <= result && result < 3) {
            res.status(200).json({
                planValidation: true,
            });
        } else if (result > 3) {
            res.status(200).json({
                planValidation: false,
            });
        }
    } catch (error) {
        next(error);
    }
};

const bookValidation = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    //  #swagger.description = '유저가 이미 읽은 책인지 아닌지 검사합니다'
    //  #swagger.tags = ['Book']
    /* #swagger.parameters['Authorization'] = {
        in: "header",                            
        description: "Authorization",                   
        required: true,                     
        type: "string"         
    } */
    /* #swagger.parameters['isbn'] = {
        in: "param",                            
        description: "북 isbn",                   
        required: true,                     
        type: "string"         
    } */
    /*  #swagger.responses[200] = {
        description: '읽지 않은 책의 경우',
        schema: {
            "readStatus": false,
        } 
    }*/
    try {
        const { isbn }: any = req.params;
        const { userId } = req.body;
        if (!isbn) throw new Error("Bad Request : isbn를 입력해주세요");

        const result = await userService.bookValidation(
            String(isbn),
            Number(userId),
        );

        res.status(200).json({ readStatus: result ? true : false });
    } catch (error) {
        next(error);
    }
};

const getUserInfo = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    //  #swagger.description = '유저 정보 조회'
    //  #swagger.tags = ['User']
    /* #swagger.parameters['Authorization'] = {
        in: "header",                            
        description: "Authorization",                   
        required: true,                     
        type: "string"         
    } */
    /*  #swagger.responses[200] = {
        description: '유저 정보',
        schema: {
            "userId": 1,
            "email": "guest@readbird.com",
            "nickName": "guest",
            "imageUrl": ""
        } 
    }*/
    try {
        const { userId } = request.body;

        const userInfo = await userService.getUserInfo(userId);

        response.status(200).json(userInfo);
    } catch (error) {
        next(error);
    }
};

export default {
    signInKakao,
    signInGuest,
    getPlanBySuccess,
    deleteAllPlan,
    restorePlan,
    findPlanByDelete,
    userSecession,
    planValidation,
    bookValidation,
    getUserInfo,
};
