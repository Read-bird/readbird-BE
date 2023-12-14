const swaggerAutogen = require("swagger-autogen")({ language: "ko" });

const doc = {
    info: {
        title: "읽어보새 API 명세서",
        description: "독서 습관 플래너 - 읽어보새의 Api 명세서 입니다.",
    },
    host: "https://port-0-readbird-be-jvpb2alnj9kv7q.sel5.cloudtype.app",
    schemes: ["https"],
    securityDefinitions: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            in: "header",
            bearerFormat: "JWT",
        },
    },
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routers/index.ts"];

swaggerAutogen(outputFile, endpointsFiles, doc);
