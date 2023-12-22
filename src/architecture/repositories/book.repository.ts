import { Op } from "sequelize";

class BookRepository {
    bookModel: any;

    constructor(Book: any) {
        this.bookModel = Book;
    }

    searchAllBooks = async (
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
                title: { [Op.like]: searchValue },
            },
            raw: true,
            offset: (page - 1) * scale,
            limit: Number(scale),
            order: [["createdAt", "DESC"]],
        });
    };
}

export default BookRepository;
