import { Router } from "express";
import user from "./user.route";
import plan from "./plan.route";
import book from "./book.route";
import authJWT from "../jwt/authJWT";

const router = Router();

router.use("/api/plan", authJWT, plan);
router.use("/api/user", user);
router.use("/api/book", authJWT, book);

export default router;
