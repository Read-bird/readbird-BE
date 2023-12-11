import PlanService from "../../../architecture/services/plan.service";

let mockPlanRepository = {
    createPlan: jest.fn(),
    findOneBook: jest.fn(),
    createBook: jest.fn(),
};

let planService = new PlanService();
planService.planRepository = mockPlanRepository;

describe("Layered Architecture Pattern Plan Service Unit Test", () => {
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
    });

    it("Plan Service - createPlan Method with book", async () => {
        const findOneBookReturnValue = {
            totalPage: 100,
            bookId: 1,
        };

        mockPlanRepository.findOneBook = jest.fn(() => {
            return findOneBookReturnValue;
        });

        const createPlanReturnValue = {
            data: {
                planId: 3,
                totalPage: 100,
                startDate: "2023-12-12",
                endDate: "2023-12-30",
                userId: 1,
                bookId: 1,
                currentPage: 0,
                status: "inProgress",
                updatedAt: "2023-12-10T19:16:23.855Z",
                createdAt: "2023-12-10T19:16:23.855Z",
            },
        };

        mockPlanRepository.createPlan = jest.fn(() => {
            return createPlanReturnValue;
        });

        const createPlanParams = {
            userId: 1,
            body: {
                bookId: 1,
                startDate: "2023-12-12",
                endDate: "2023-12-30",
                title: "title",
                author: "author",
                totalPage: 100,
            },
        };

        const newPlan = await planService.createPlan(createPlanParams);

        expect(newPlan).toBe(createPlanReturnValue);
        expect(mockPlanRepository.findOneBook).toHaveBeenCalledTimes(1);
        expect(mockPlanRepository.findOneBook).toHaveBeenCalledWith(
            createPlanParams.body.bookId,
        );
        expect(mockPlanRepository.createPlan).toHaveBeenCalledTimes(1);
        expect(mockPlanRepository.createPlan).toHaveBeenCalledWith(
            createPlanParams.body.totalPage,
            createPlanParams.body.startDate,
            createPlanParams.body.endDate,
            createPlanParams.userId,
            createPlanParams.body.bookId,
        );
    });

    it("Plan Service - createPlan Method without book", async () => {
        const findOneBookReturnValue = null;

        mockPlanRepository.findOneBook = jest.fn(() => {
            return findOneBookReturnValue;
        });

        const createBookReturnValue = {
            bookId: 1,
            title: "title",
            author: "author",
            description: null,
            isbn: null,
            coverImage: null,
            publisher: null,
            pubDate: null,
            updatedAt: "2023-12-10T19:16:23.855Z",
            createdAt: "2023-12-10T19:16:23.855Z",
        };

        mockPlanRepository.createBook = jest.fn(() => {
            return createBookReturnValue;
        });

        const createPlanReturnValue = {
            data: {
                planId: 3,
                totalPage: 100,
                startDate: "2023-12-12",
                endDate: "2023-12-30",
                userId: 1,
                bookId: 1,
                currentPage: 0,
                status: "inProgress",
                updatedAt: "2023-12-10T19:16:23.855Z",
                createdAt: "2023-12-10T19:16:23.855Z",
            },
        };

        mockPlanRepository.createPlan = jest.fn(() => {
            return createPlanReturnValue;
        });

        const createPlanParams = {
            userId: 1,
            body: {
                bookId: 1,
                startDate: "2023-12-12",
                endDate: "2023-12-30",
                title: "title",
                author: "author",
                totalPage: 100,
            },
        };

        const newPlan = await planService.createPlan(createPlanParams);

        expect(newPlan).toBe(createPlanReturnValue);

        expect(mockPlanRepository.createBook).toHaveBeenCalledTimes(1);
        expect(mockPlanRepository.createBook).toHaveBeenCalledWith({
            title: createPlanParams.body.title,
            author: createPlanParams.body.author,
            totalPage: createPlanParams.body.totalPage,
            description: null,
            isbn: null,
            coverImage: null,
            publisher: null,
            pubDate: null,
        });

        expect(mockPlanRepository.createPlan).toHaveBeenCalledTimes(1);
        expect(mockPlanRepository.createPlan).toHaveBeenCalledWith(
            createPlanParams.body.totalPage,
            createPlanParams.body.startDate,
            createPlanParams.body.endDate,
            createPlanParams.userId,
            createPlanParams.body.bookId,
        );
    });

    it("Plan Service - createPlan Method Error", async () => {
        const createPlanParams = {
            userId: 1,
            body: {
                bookId: 1,
                startDate: 1,
            },
        };
        try {
            const errorPlan = await planService.createPlan(createPlanParams);
            console.log(errorPlan);
        } catch (error) {
            expect(error.message).toEqual(
                "올바르지않은 날짜 형식입니다. 형식은 yyyy-mm-dd 입니다.",
            );
        }
    });
});
