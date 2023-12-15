import { Op } from "sequelize";

class PlanRepository {
    planModel: any;
    bookModel: any;
    recordModel: any;

    constructor(Plan: any, Book: any, Record: any) {
        this.planModel = Plan;
        this.bookModel = Book;
        this.recordModel = Record;
    }

    createPlan = async (
        totalPage: number,
        startDate: Date,
        endDate: Date,
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

    getInProgressPlan = async (userId: number) => {
        return this.planModel.findAll({
            where: {
                userId,
                status: "inProgress",
            },
            raw: true,
        });
    };

    findOneBook = async (bookId: number) => {
        return this.bookModel.findOne({
            raw: true,
            where: { bookId },
        });
    };

    createBook = async (newBook: any) => {
        return this.bookModel.create(newBook);
    };

    getTodayPlans = async (userId: number, date: Date) => {
        console.log(date);
        return this.planModel.findAll({
            include: [
                {
                    model: this.recordModel,
                    where: {
                        successAt: date.toISOString().split("T")[0],
                    },
                    attributes: ["status", "successAt"],
                    required: false,
                    as: "records",
                },
                {
                    model: this.bookModel,
                    attributes: [
                        "bookId",
                        "title",
                        "author",
                        "description",
                        "coverImage",
                        "isbn",
                    ],
                    required: false,
                },
            ],
            where: {
                userId,
                startDate: {
                    [Op.lte]: date,
                },
                endDate: {
                    [Op.gte]: date,
                },
            },
            raw: true,
        });
    };

    getInProgressPlans = async (userId: number) => {
        return this.planModel.findAll({
            where: {
                userId,
                status: "inProgress",
                endDate: {
                    [Op.lte]: new Date(),
                },
            },
            raw: true,
        });
    };

    updateInProgressPlans = async (
        planId: number,
        userId: number,
        status: string,
    ) => {
        return this.planModel.update(
            { status },
            {
                where: {
                    userId,
                    planId,
                },
                raw: true,
            },
        );
    };

    updatePlan = async (userId: number, planId: number, endDate: string) => {
        return this.planModel.update(
            {
                endDate,
            },
            {
                where: {
                    planId,
                    userId,
                },
                raw: true,
            },
        );
    };

    findOnePlanById = async (planId: any) => {
        return this.planModel.findOne({ where: { planId }, raw: true });
    };
}

export default PlanRepository;
