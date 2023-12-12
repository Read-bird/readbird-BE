import { Request, Response } from "express";
import jwtUtil from "./jwt-util";
import jwt from "jsonwebtoken";

export const refresh = async (req: Request, res: Response) => {
    if (req.headers.authorization && req.headers.refresh) {
        const authToken = req.headers.authorization.split("Bearer ")[1];
        const refreshToken = req.headers.refresh;

        //access token 검증 -> 토큰이 만료되면 {"ok":false, "message":"jwt expired"} 반환
        const authResult = jwtUtil.verify(authToken);
        console.log("\nauthResult ::: " + JSON.stringify(authResult));

        //access token을 디코딩하여 user의 정보를 가져온다
        const decoded: any = jwt.decode(authToken);

        //디코딩 결과가 없으면 권한 없음을 응답
        if (decoded === null) {
            return res.status(401).send("error: 토큰이 유효하지 않음");
        }

        //access token의 decoding된 값에서 유저의 email를 가져와 refresh token을 검증
        const refreshResult: any = jwtUtil.refreshVerify(
            refreshToken,
            decoded.email,
        );
        //재발급을 위해서는 access token이 만료되어 있어야 한다
        if (authResult.ok === false && authResult.message === "jwt expired") {
            //1. access token이 만료되고, refresh token도 만료된 경우 -> 새로 로그인
            if ((await refreshResult) == false) {
                return res
                    .status(412)
                    .send("accessToken, refreshToken 만료 재 로그인 필요");
            } else {
                //2. access token이 만료되고, refresh token은 만료되지 않은 경우 -> 새로운 access token을 발급
                const newAccessToken = jwtUtil.sign(decoded);
                return res.status(200).json({
                    data: {
                        accessToken: newAccessToken,
                        refreshToken: refreshToken,
                    },
                });
            }
        } else {
            //3. access token이 만료되지 않은 경우 -> refresh 할 필요가 없다
            return res.status(200).send("accessToken이 만료 되지 않음");
        }
    } else {
        //access token 또는 refresh token이 헤더에 없는 경우
        return res
            .status(401)
            .send("header에 accessToken 또는 refreshToken이 존재 하지 않음");
    }
};

export default refresh;
