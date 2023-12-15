import { NextFunction, Request, Response } from "express";
import BookService from "../services/book.service";

class BookController {
    bookService = new BookService();

    searchBooks = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            let { title, page, scale }: any = request.query;

            if (!title || title.length === 0)
                throw new Error("Bad Request : 검색어를 입력해주세요.");

            if (!page || page === null) page = 1;
            if (!scale || scale === null) scale = 10;

            const searchBookList = await this.bookService.searchAllBooks(
                title,
                page,
                scale,
            );

            response.status(200).json({
                page: Number(page),
                scale: Number(scale),
                totalPage: searchBookList.count,
                bookList: searchBookList.rows,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default BookController;
