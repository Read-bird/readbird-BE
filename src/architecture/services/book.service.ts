import { Book } from "../../db/models/domain/Tables";
import BookRepository from "../repositories/book.repository";

class BookService {
    bookRepository: BookRepository;

    constructor() {
        this.bookRepository = new BookRepository(Book);
    }

    searchAllBooks = async (title: string, page: number, scale: number) => {
        const searchValue: string = `%${title.replace(
            /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/ ]/g,
            "",
        )}%`;

        const dd = await this.bookRepository.searchAllBooks(
            searchValue,
            page,
            scale,
        );

        return dd;
    };

    getBookDetail = async (bookId: number) => {
        return await this.bookRepository.getBookDetail(bookId);
    };
}

export default BookService;
