import PlanRepository from "../repositories/plan.repository";
import { Book } from "../../db/models/domain/Book";
import { Plan } from "../../db/models/domain/Plan";

class PlanService {
    planRepository: PlanRepository;

    constructor() {
        this.planRepository = new PlanRepository(Plan, Book);
    }

    createPlan = async ({ userId, body }: { userId: number; body: any }) => {
        const { bookId, startDate, endDate } = body;
        let newTotalPage;
        let newBookId = bookId;

        const dateForm = RegExp(
            /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
        );
        if (!dateForm.test(startDate) || !dateForm.test(endDate)) {
            throw new Error(
                "올바르지않은 날짜 형식입니다. 형식은 yyyy-mm-dd 입니다.",
            );
        }

        const bookData = await this.planRepository.findOneBook(bookId);

        if (bookData === null) {
            const { title, author, totalPage } = body;

            const newBook = {
                title,
                author,
                totalPage,
                description: null,
                isbn: null,
                coverImage: null,
                publisher: null,
                pubDate: null,
            };

            const newBookData = await this.planRepository.createBook(newBook);

            newBookId = newBookData.bookId;
            newTotalPage = totalPage;
        } else {
            newTotalPage = bookData.totalPage;
        }

        return this.planRepository.createPlan(
            newTotalPage,
            startDate,
            endDate,
            userId,
            newBookId,
        );
    };
}

export default PlanService;
