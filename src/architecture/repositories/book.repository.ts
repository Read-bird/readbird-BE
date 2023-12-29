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
        let searchType = { [type]: { [Op.like]: searchValue } };

        if (type === "all") {
            searchType = {
                [Op.or]: {
                    title: { [Op.like]: searchValue },
                    author: { [Op.like]: searchValue },
                    publisher: { [Op.like]: searchValue },
                },
            };
        }

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
            where: searchType,
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
