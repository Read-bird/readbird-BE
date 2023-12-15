require("dotenv").config();
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import sequelize from "./db/models";
import router from "./routers/index";

import swaggerUi from "swagger-ui-express";
import swaggerJson from "./swagger.json";
import req from "request";
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

app.use(express.json());

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

//index 라우터
app.use(router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));
/**/

const ttbkey: String | undefined = process.env.ttbkey;
const BookList_URL: any = "http://www.aladin.co.kr/ttb/api/ItemSearch.aspx?";

const BookListOption: any = {
    ttbkey: ttbkey,
    Query: "aladdin",
    QueryType: "Title",
    MaxResults: "10",
    start: "1",
    SearchTarget: "Book",
    output: "js",
};
const aladinBookList: any = req(
    BookList_URL,
    BookListOption,
    function (err: Error, res, body) {
        //console.log("\nerr1 ::: " + err);
        if (res.statusCode == 200) {
            //console.log("\nbody ::: " + body);
        }
    },
);
const BookDetail_URL: any =
    "http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=" +
    ttbkey +
    "&itemIdType=ItemId&ItemId=887619&output=JS";
const BookDetailOption: any = {
    //ttbkey: ttbkey,
    ItemIdType: "ItemId",
    ItemId: "269866535",
    output: "JS",
};

const aladinBookDetail: any = req(
    BookDetail_URL,
    BookDetailOption,
    function (err: Error, res, body) {
        //console.log("\nerr2 ::: " + err);
        //console.log("\nres ::: " + JSON.stringify(res));
        if (res.statusCode == 200) {
            console.log("\nbody ::: " + body);
        }
    },
);

/**/
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
        } else {
            response.status(500).json({ message: "Server Error" });
        }
    },
);
