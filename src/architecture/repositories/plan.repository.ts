class PlanRepository {
    planModel: any;
    bookModel: any;

    constructor(Plan: any, Book: any) {
        this.planModel = Plan;
        this.bookModel = Book;
    }

    createPlan = async (
        totalPage: number,
        startDate: string,
        endDate: string,
        userId: number,
        bookId: number,
    ) => {
        return this.planModel.create({
            totalPage,
            startDate,
            endDate,
            userId,
            bookId,
            currentPage: 0,
            status: "inProgress",
        });
    };

    findOneBook = async (bookId: number) => {
        return this.bookModel.findOne({
            raw: true,
            where: { bookId },
        });
    };

    createBook = async (newBook: any) => {
        return this.bookModel.create({
            newBook,
        });
    };
}

export default PlanRepository;
