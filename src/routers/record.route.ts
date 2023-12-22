import express, { Router } from "express";
import RecordController from "../architecture/controllers/record.controller";

const router: Router = express.Router();
const recordController = new RecordController();

router.get("/", recordController.getRecordByMonth);
router.put("/:planId", recordController.changeRecord);

export default router;
