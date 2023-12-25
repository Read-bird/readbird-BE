import express, { Router } from "express";
import BookController from "../architecture/controllers/book.controller";
import authJWT from "../jwt/authJWT";

const router: Router = express.Router();
const bookController = new BookController();

router.get("/", bookController.searchBooks);
router.get("/:bookId", authJWT, bookController.getBookDetail);

export default router;
