import { Op } from "sequelize";
import getDateFormat from "../../util/setDateFormat";

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
        currentPage: number,
    ) => {
        return this.planModel.create({
            totalPage,
            startDate,
            endDate,
            userId,
            bookId,
            currentPage,
            status: "inProgress",
        });
    };

    findOnePlanById = async (planId: any) => {
        return this.planModel.findOne({
            include: {
                model: this.bookModel,
                attributes: [
                    "bookId",
                    "title",
                    "author",
                    "publisher",
                    "description",
                    "coverImage",
                    "isbn",
                ],
                required: false,
            },
            where: { planId },
            raw: true,
        });
    };

    getTodayPlans = async (userId: number, baseDate: Date) => {
        return this.planModel.findAll({
            include: [
                {
                    model: this.recordModel,
                    where: {
                        successAt: baseDate.toISOString().split("T")[0],
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
                        "publisher",
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
                    [Op.lte]: baseDate,
                },
                endDate: {
                    [Op.gte]: baseDate,
                },
                status: {
                    [Op.or]: ["success", "inProgress", "failed"],
                },
            },
            raw: true,
        });
    };

    // 유저가 현재 진행중(plan.status = inProgress)인 플랜의 개수
    getInProgressPlans = async (userId: number) => {
        return this.planModel.findAll({
            where: {
                userId,
                status: "inProgress",
            },
            raw: true,
        });
    };

    // 종료일(endDate)이 지나버린 진행중(plan.status = inProgress) 플랜
    getPastInProgressPlans = async (userId: number) => {
        return this.planModel.findAll({
            include: {
                model: this.bookModel,
                attributes: [
                    "bookId",
                    "title",
                    "author",
                    "publisher",
                    "description",
                    "coverImage",
                    "isbn",
                ],
                required: false,
            },
            where: {
                userId,
                status: "inProgress",
                endDate: {
                    [Op.lt]: new Date(getDateFormat(new Date())),
                },
            },
            raw: true,
        });
    };

    getInProgressCount = async (userId: number) => {
        return this.planModel.count({
            where: {
                userId,
                status: "inProgress",
            },
        });
    };

    updatePlan = async (
        planId: number,
        userId: number,
        type: string,
        value: string,
    ) => {
        await this.planModel.update(
            { [type]: value },
            {
                where: {
                    userId,
                    planId,
                },
            },
        );
    };

    updateStartDate = async (planId: number, date: string) => {
        await this.planModel.update(
            { startDate: date },
            {
                where: {
                    planId,
                },
            },
        );
    };

    updateEndDate = async (planId: number, date: string) => {
        await this.planModel.update(
            { endDate: date },
            {
                where: {
                    planId,
                },
            },
        );
    };

    deletePlan = async (userId: number, planId: number) => {
        return this.planModel.update(
            { status: "delete" },
            { where: { userId, planId }, raw: true },
        );
    };

    findOneBook = async (type: string, value: string | number) => {
        return this.bookModel.findOne({
            raw: true,
            where: { [type]: value },
        });
    };

    createBook = async (newBook: any) => {
        return this.bookModel.create(newBook);
    };
}

export default PlanRepository;
