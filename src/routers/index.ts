import { Router } from "express";
import user from "./user.route";
import plan from "./plan.route";
import book from "./book.route";
import record from "./record.route";
import collection from "./collection.route";
import authJWT from "../jwt/authJWT";

const router = Router();

router.use("/api/user", user);
router.use("/api/plan", authJWT, plan);
router.use("/api/book", authJWT, book);
router.use("/api/record", authJWT, record);
router.use("/api/collection", authJWT, collection);

export default router;
