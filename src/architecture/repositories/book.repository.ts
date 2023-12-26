import { Op } from "sequelize";

class BookRepository {
    bookModel: any;

    constructor(Book: any) {
        this.bookModel = Book;
    }

    searchAllBooks = async (
        type: string,
        searchValue: string,
        page: number,
        scale: number,
    ) => {
        return this.bookModel.findAndCountAll({
            attributes: [
                "bookId",
                "title",
                "author",
                "pubDate",
                "description",
                "isbn",
                "publisher",
                "totalPage",
                "coverImage",
            ],
            where: {
                [type]: { [Op.like]: searchValue },
            },
            raw: true,
            offset: (page - 1) * scale,
            limit: Number(scale),
            order: [["createdAt", "DESC"]],
        });
    };

    getBookDetail = async (bookId: number) => {
        return await this.bookModel.findOne({
            attributes: [
                "bookId",
                "title",
                "author",
                "pubDate",
                "description",
                "isbn",
                "publisher",
                "totalPage",
                "coverImage",
            ],
            where: {
                bookId: bookId,
            },
        });
    };
}

export default BookRepository;
