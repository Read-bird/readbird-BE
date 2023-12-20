import { Plan, Record } from "../../db/models/domain/Tables";
import getDateFormat from "../../util/setDateFormat";
import RecordRepository from "../repositories/record.repository";

class RecordService {
    recordRepository: RecordRepository;

    constructor() {
        this.recordRepository = new RecordRepository(Record, Plan);
    }

    changeRecord = async (
        planId: number,
        userId: number,
        status: string,
        currentPage: number | undefined,
    ) => {
        const today = getDateFormat(new Date());

        const plan = await this.recordRepository.findOnePlanById(
            planId,
            userId,
            today,
        );

        if (!plan) throw new Error("Not Found : 플랜을 찾을 수 없습니다.");

        if (plan.status === "failed" || plan.status === "success")
            throw new Error(
                "Bad Request : 이미 성공 혹은 실패한 플랜은 수정할 수 없습니다.",
            );

        if (plan.status === "delete")
            throw new Error("Bad Request : 삭제된 플랜입니다.");

        if (plan["records.recordId"] === null) {
            if (status === "failed")
                throw new Error(
                    "Bad Request : 변경 status와 현재 status가 같습니다.",
                );

            await this.recordRepository.createRecord(
                userId,
                planId,
                today,
                status,
            );
        }

        if (plan["records.recordId"] !== null) {
            if (status === plan["records.status"])
                throw new Error(
                    "Bad Request : 변경 status와 현재 status가 같습니다.",
                );

            if (status === "failed") {
                await this.recordRepository.deleteRecord(
                    plan["records.recordId"],
                );
            } else {
                await this.recordRepository.updateRecord(
                    plan["records.recordId"],
                    status,
                );
            }
        }

        const newPage =
            plan.currentPage + currentPage > plan.totalPage
                ? plan.totalPage
                : plan.currentPage + currentPage;

        const updatePlanCurrentPage = status === "failed" ? 0 : newPage;

        const planStatus =
            plan.totalPage === updatePlanCurrentPage ? "success" : plan.status;

        await this.recordRepository.updatePlan(
            planId,
            updatePlanCurrentPage,
            planStatus,
        );

        const updatedPlan = await this.recordRepository.findOnePlanById(
            planId,
            userId,
            today,
        );

        const returnMessage =
            updatedPlan.currentPage >= updatedPlan.totalPage ? true : false;

        return returnMessage;
    };
}

export default RecordService;
