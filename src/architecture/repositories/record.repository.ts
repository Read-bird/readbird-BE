import { Op } from "sequelize";

class RecordRepository {
    recordModel: any;
    planModel: any;

    constructor(Record: any, Plan: any) {
        this.recordModel = Record;
        this.planModel = Plan;
    }

    findOnePlanById = async (planId: number, userId: number, today: string) => {
        return this.planModel.findOne({
            include: {
                model: this.recordModel,
                where: {
                    successAt: today,
                },
                attributes: ["recordId", "status", "successAt"],
                required: false,
                as: "records",
            },
            where: {
                planId,
                userId,
            },
            raw: true,
        });
    };

    findRecordByDate = async (
        userId: number,
        planId: number,
        successAt: string,
    ) => {
        return this.recordModel.findOne({
            where: { userId, planId, successAt },
            raw: true,
        });
    };

    createRecord = async (
        userId: number,
        planId: number,
        successAt: string,
        status: string,
    ) => {
        return this.recordModel.create({
            userId,
            planId,
            status,
            successAt,
        });
    };

    deleteRecord = async (recordId: number) => {
        return this.recordModel.destroy({
            where: { recordId },
        });
    };

    updateRecord = async (recordId: number, status: string) => {
        return this.recordModel.update(
            {
                status,
            },
            {
                where: { recordId },
            },
        );
    };

    updatePlan = async (
        planId: number,
        currentPage: number,
        status: string,
    ) => {
        return this.planModel.update(
            { currentPage, status },
            {
                where: { planId },
                raw: true,
            },
        );
    };

    getTodayPlans = async (userId: number, date: Date) => {
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
            ],
            where: {
                userId,
                startDate: {
                    [Op.lte]: date,
                },
                endDate: {
                    [Op.gte]: date,
                },
                status: {
                    [Op.ne]: "delete",
                },
            },
            raw: true,
        });
    };
}

export default RecordRepository;
