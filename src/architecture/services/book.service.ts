import { Book } from "../../db/models/domain/Tables";
import BookRepository from "../repositories/book.repository";

class BookService {
    bookRepository: BookRepository;

    constructor() {
        this.bookRepository = new BookRepository(Book);
    }

    searchAllBooks = async (
        value: string,
        page: number,
        scale: number,
        type: string,
    ) => {
        const searchValue: string = `%${value.replace(
            /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/g,
            "%",
        )}%`;

        const getBookList = await this.bookRepository.searchAllBooks(
            type,
            searchValue,
            page,
            scale,
        );

        return {
            totalCount: getBookList.count,
            totalPage: Math.ceil(getBookList.count / scale),
            bookList: getBookList.rows,
        };
    };

    getBookDetail = async (bookId: number) => {
        return await this.bookRepository.getBookDetail(bookId);
    };
}

export default BookService;
