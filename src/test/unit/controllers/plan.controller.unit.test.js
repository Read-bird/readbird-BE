import PlanController from "../../../architecture/controllers/plan.controller";

let mockPlanService = {
    createPlan: jest.fn(),
};

let mockRequest = {
    body: jest.fn(),
};

let mockResponse = {
    status: jest.fn(),
    json: jest.fn(),
};

let mockNext = jest.fn();

let planController = new PlanController();
planController.planService = mockPlanService;

describe("Layered Architecture Pattern Plan Controller Unit Test", () => {
    beforeEach(() => {
        jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

        // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
        mockResponse.status = jest.fn(() => {
            return mockResponse;
        });
    });

    it("Plan Controller - createPlan Method by Success", async () => {
        const createPlanRequestBodyParams = {
            bookId: 1,
            startDate: "2023-12-12",
            endDate: "2023-12-12",
        };

        mockRequest.body = createPlanRequestBodyParams;

        const createPlanReturnValue = {
            planId: 24,
            totalPage: 900,
            startDate: "2023-12-12",
            endDate: "2023-12-12",
            userId: 1,
            bookId: 1,
            currentPage: 0,
            status: "inProgress",
            updatedAt: "2023-12-10T23:01:27.547Z",
            createdAt: "2023-12-10T23:01:27.547Z",
        };

        mockPlanService.createPlan = jest.fn(() => createPlanReturnValue);

        await planController.createPlan(mockRequest, mockResponse, mockNext);

        expect(mockPlanService.createPlan).toHaveBeenCalledTimes(1);
        expect(mockPlanService.createPlan).toHaveBeenCalledWith({
            userId: 1,
            body: createPlanRequestBodyParams,
        });

        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(201);

        expect(mockResponse.json).toHaveBeenCalledWith({
            data: createPlanReturnValue,
        });
    });
});
