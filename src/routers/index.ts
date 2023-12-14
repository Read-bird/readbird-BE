import { Router } from "express";
import plan from "./plan.route";
import userRouter from "./user.route";

const router = Router();

router.use("/api/plan", plan);
router.use("/api/user", userRouter);

export default router;
