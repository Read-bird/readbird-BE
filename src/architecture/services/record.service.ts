import { Plan, Record } from "../../db/models/domain/Tables";
import makeMonthArr from "../../util/makeMonthArr";
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

        const updatePlanCurrentPage =
            status === "failed" ? 0 : plan.currentPage + currentPage;
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

    getRecordByMonth = async (userId: number, date: string) => {
        const dateForm = RegExp(
            /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
        );

        const baseDate = date + "-01";

        if (!dateForm.test(baseDate)) {
            throw new Error(
                "Bad Request : 올바르지않은 날짜 형식입니다. 형식은 yyyy-mm 입니다.",
            );
        }

        let monthRecord = [];
        const monthDateArr = makeMonthArr(new Date(baseDate));

        for (let i = 0; i < monthDateArr.length; i++) {
            let achievementStatus: string | null = "failed";

            const findAllPlansByDate =
                await this.recordRepository.getTodayPlans(
                    userId,
                    monthDateArr[i],
                );

            const dateRecord = findAllPlansByDate.map((plan: any) => {
                return plan["records.status"];
            });

            if (
                dateRecord.indexOf("success") !== -1 &&
                dateRecord.indexOf(null) !== -1
            ) {
                achievementStatus = "unTable";
            } else if (
                dateRecord.indexOf("success") !== -1 &&
                !dateRecord.indexOf(null)
            ) {
                achievementStatus = "success";
            } else if (new Date() < monthDateArr[i]) {
                achievementStatus = null;
            }

            monthRecord.push({
                date: monthDateArr[i].toISOString().split("T")[0],
                achievementStatus,
            });
        }

        return monthRecord;
    };
}

export default RecordService;
