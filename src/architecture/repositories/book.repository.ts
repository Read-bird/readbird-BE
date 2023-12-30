class BookRepository {
    bookModel: any;

    constructor(Book: any) {
        this.bookModel = Book;
    }

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
