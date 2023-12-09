require("dotenv").config();
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import sequelize from "./db/models";

const app: Application = express();

const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

const corsOption = {
    origin: true,
    credentials: true,
    withCredential: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ["accesstoken", "refreshtoken"],
};
app.use(cors(corsOption));

app.listen(PORT, async () => {
    console.log(`App is listening on port ${PORT}!`);

    //sequelize-db 연결 테스트
    await sequelize
        .authenticate()
        .then(async () => {
            console.log("DB connection success");
        })
        .catch((e: unknown) => {
            console.log("TT : ", e);
        });
});

app.get("/", (request: Request, response: Response) => {
    response.send(`${process.env.PORT}포트로 서버가 열렸습니다.`);
});

// 서버측 에러 핸들링 부분
app.use(
    (
        error: { message: string },
        request: Request,
        response: Response,
        next: NextFunction,
    ): void => {
        response.status(500).json({ message: error.message });
    },
);
