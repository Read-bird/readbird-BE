import { Router } from "express";

import plan from "./plan.route";

const router = Router();

router.use("/api/plan", plan);

export default router;
