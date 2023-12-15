import express, { Router } from "express";
import PlanController from "../architecture/controllers/plan.controller";

const router: Router = express.Router();
const planController = new PlanController();

router.post("/", planController.createPlan);
router.get("/", planController.findAllPlansByDate);
router.put("/:planId", planController.updatePlan);

export default router;
