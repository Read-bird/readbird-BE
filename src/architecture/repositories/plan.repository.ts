import { Book } from "../../db/models/domain/Book";
import { Plan } from "../../db/models/domain/Plan";

class PlanRepository {
    createPlan = async (
        totalPage: number,
        startDate: string,
        endDate: string,
        userId: number,
        bookId: number,
    ) => {
        return Plan.create({
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
        return Book.findOne({
            raw: true,
            where: { bookId },
        });
    };
}

export default PlanRepository;
