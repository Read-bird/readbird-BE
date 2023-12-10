import PlanRepository from "../repositories/plan.repository";

class PlanService {
    planRepository: PlanRepository;

    constructor() {
        this.planRepository = new PlanRepository();
    }

    createPlan = async (
        userId: number,
        bookId: number,
        startDate: string,
        endDate: string,
    ) => {
        let totalPage = 0;

        //bookId 검색 findOneBookId
        const bookData = await this.planRepository.findOneBook(bookId);

        //bookId가 없을 경우
        //createBook
        if (bookData === null) {
        } else {
            totalPage = bookData.totalPage;
        }

        //plan data 정리

        //createPlan
        return this.planRepository.createPlan(
            totalPage,
            startDate,
            endDate,
            userId,
            bookId,
        );
    };
}

export default PlanService;
