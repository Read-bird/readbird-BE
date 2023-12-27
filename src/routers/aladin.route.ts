import express, { Router } from "express";
import aladinController from "../architecture/controllers/aladin.controller";

const router: Router = express.Router();

router.get("/popular", aladinController.popularBook);

export default router;
