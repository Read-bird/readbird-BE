import { Router } from "express";
import user from "./user.route";
import plan from "./plan.route";

const router = Router();

router.use("/api/plan", plan);
router.use("/api/user", user);
export default router;
