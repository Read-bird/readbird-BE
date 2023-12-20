import express from "express";
import userController from "../architecture/controllers/user.controller";
import refresh from "../jwt/refresh";
import authJWT from "../jwt/authJWT";

const userRouter = express.Router();

userRouter.post("/login", userController.signInKakao);
userRouter.post("/token", refresh);
userRouter.post("/login-guest", userController.signInGuest);
userRouter.get("/plan/success", authJWT, userController.getPlanBySuccess);
userRouter.delete("/plan/delete", authJWT, userController.deleteAllPlan);

export default userRouter;
