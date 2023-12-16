import express, { Router } from "express";
import BookController from "../architecture/controllers/book.controller";

const router: Router = express.Router();
const bookController = new BookController();

router.get("/", bookController.searchBooks);

export default router;
