import express from "express";
import userController from "../architecture/controllers/user.controller";
import refresh from "../jwt/refresh";
const userRouter = express.Router();

userRouter.post("/login", userController.signInKakao);
userRouter.post("/token", refresh);

export default userRouter;
