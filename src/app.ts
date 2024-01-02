require("dotenv").config();
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import sequelize from "./db/models";
import router from "./routers/index";
import morgan from "morgan";
import { stream } from "./util/winston";

const app: Application = express();

const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

const corsOption = {
    origin: true, //출처 허용 옵션
    credentials: true, //사용자 인증이 필요한 리소스 접근
    withCredential: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ["Authorization", "RefreshToken"],
};
app.use(cors(corsOption));

app.use(express.json());

app.use(helmet({ contentSecurityPolicy: false }));

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

app.use(morgan("combined", { stream }));

app.get("/", (request: Request, response: Response) => {
    response.send(`${process.env.PORT}포트로 서버가 열렸습니다.`);
});

//index 라우터
app.use(router);

//swagger
import swaggerUi from "swagger-ui-express";
import swaggerJson from "./swagger.json";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));

// 서버측 에러 핸들링 부분
app.use(
    (
        error: any,
        request: Request,
        response: Response,
        next: NextFunction,
    ): void => {
        if (error.message.includes("Bad Request")) {
            response.status(400).json({ message: error.message });
        } else if (error.message.includes("Not Found")) {
            response.status(404).json({ message: error.message });
        } else if (error.message.includes("Aladin Error")) {
            response.status(500).json({ message: error.message });
        } else {
            console.error(error);
            response.status(500).json({ message: "Server Error" });
        }
    },
);
