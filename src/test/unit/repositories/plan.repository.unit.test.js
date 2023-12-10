import PlanRepository from "../../../architecture/repositories/plan.repository";

let mockPlanModel = {
    create: jest.fn(),
};

let mockBookModel = {
    create: jest.fn(),
    findOne: jest.fn(),
};

let planRepository = new PlanRepository(mockPlanModel, mockBookModel);

describe("Layered Architecture Pattern Plan Repository Unit test", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("Plan Repository - createPlan Method", async () => {
        mockPlanModel.create = jest.fn(() => {
            return "create success";
        });

        const createPlanParams = {
            totalPage: 100,
            startDate: "2023-12-13",
            endDate: "2023-12-30",
            userId: 1,
            bookId: 1,
            currentPage: 0,
            status: "inProgress",
        };

        const newPlan = await planRepository.createPlan(
            createPlanParams.totalPage,
            createPlanParams.startDate,
            createPlanParams.endDate,
            createPlanParams.userId,
            createPlanParams.bookId,
        );

        expect(newPlan).toBe("create success");
        expect(mockPlanModel.create).toHaveBeenCalledTimes(1);
        expect(mockPlanModel.create).toHaveBeenCalledWith(createPlanParams);
    });

    it("Plan Repository - findOneBook Method", async () => {
        mockBookModel.findOne = jest.fn(() => {
            return "findOne success";
        });

        const bookId = 1;
        const book = await planRepository.findOneBook(bookId);

        expect(planRepository.bookModel.findOne).toHaveBeenCalledTimes(1);
        expect(book).toBe("findOne success");
    });

    it("Plan Repository - createBook Method", async () => {
        mockBookModel.create = jest.fn(() => {
            return "create success";
        });

        const createBookParams = {
            title: "title",
            author: "author",
            totalPage: 100,
            description: "",
            isbn: "",
            coverImage: "",
            publisher: "",
            pubDate: "",
        };

        const newBook = await planRepository.createBook(createBookParams);

        expect(newBook).toBe("create success");
        expect(mockBookModel.create).toHaveBeenCalledTimes(1);
        expect(mockBookModel.create).toHaveBeenCalledWith({
            newBook: createBookParams,
        });
    });
});
