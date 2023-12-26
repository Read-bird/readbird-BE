import {
    Character,
    Collection,
    Plan,
    Record,
} from "../../db/models/domain/Tables";
import makeMonthArr from "../../util/makeMonthArr";
import getDateFormat from "../../util/setDateFormat";
import RecordRepository from "../repositories/record.repository";

class RecordService {
    recordRepository: RecordRepository;

    constructor() {
        this.recordRepository = new RecordRepository(
            Record,
            Plan,
            Collection,
            Character,
        );
    }

    changeRecord = async (
        planId: number,
        userId: number,
        status: string,
        currentPage: number,
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

        if (plan["records.status"] === null) {
            await this.recordRepository.createRecord(
                userId,
                planId,
                today,
                status,
            );
        } else {
            if (status === plan["records.status"])
                throw new Error(
                    "Bad Request : 변경 status와 현재 status가 같습니다.",
                );

            await this.recordRepository.updateRecord(
                plan["records.recordId"],
                status,
            );
        }

        const updateCurrentPage =
            currentPage >= plan.totalPage ? plan.totalPage : currentPage;

        const planStatus =
            currentPage >= plan.totalPage ? "success" : plan.status;

        await this.recordRepository.updatePlan(
            planId,
            updateCurrentPage,
            planStatus,
        );

        const updatedPlan = await this.recordRepository.findOnePlanById(
            planId,
            userId,
            today,
        );

        let newCharacter = {};
        let returnMessage = false;

        if (updatedPlan.status === "success") {
            const NUMBER_CHARACTERS = 16;
            const NORMAL_CHARACTERS = 12;
            const EVENT_CHARACTERS = 18;

            const isEvent = new Date() < new Date("2024-02-29");

            const userCollection =
                await this.recordRepository.findOneCollectionByUserId(userId);

            if (userCollection === null)
                throw new Error(
                    "Bad Request : 아직 첫 캐릭터를 얻지 않았습니다. 확인이 필요합니다.",
                );

            let characterId = 0;
            let collectionContents = JSON.parse(userCollection.contents);

            if (
                collectionContents.length >=
                (isEvent ? EVENT_CHARACTERS : NORMAL_CHARACTERS)
            ) {
                newCharacter = {
                    message: "더이상 새로운 캐릭터를 얻을 수 없습니다.",
                };
            } else {
                while (true) {
                    const randomNum = Math.floor(
                        Math.random() *
                            (isEvent ? EVENT_CHARACTERS : NUMBER_CHARACTERS) +
                            1,
                    );

                    if (randomNum < 12 || randomNum > 16) {
                        const validation = collectionContents.findIndex(
                            (content: any) => content.characterId === randomNum,
                        );

                        if (validation === -1) {
                            characterId = randomNum;
                            break;
                        }
                    }
                }

                newCharacter =
                    await this.recordRepository.findNewCharacter(characterId);

                const updateCollection =
                    await this.recordRepository.updateCollection(
                        userId,
                        JSON.stringify([...collectionContents, newCharacter]),
                    );

                if (!updateCollection)
                    throw new Error(
                        "Server Error : 업데이트에 실패하였습니다. 다시 시도해주세요.",
                    );
            }

            returnMessage = true;
        }

        return { returnMessage, newCharacter };
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
        let recordTrophy = 0;
        const monthDateArr = makeMonthArr(new Date(baseDate));

        for (let i = 0; i < monthDateArr.length; i++) {
            let achievementStatus: string | null = "failed";

            const findAllPlansByDate =
                await this.recordRepository.getTodayPlans(
                    userId,
                    monthDateArr[i],
                );

            const dateRecord = findAllPlansByDate.map((plan: any) => {
                if (plan["records.status"] === "success") recordTrophy += 1;
                return plan["records.status"];
            });

            if (
                dateRecord.indexOf("success") !== -1 &&
                (dateRecord.indexOf(null) !== -1 ||
                    dateRecord.indexOf("failed") !== -1)
            ) {
                achievementStatus = "unstable";
            } else if (
                dateRecord.indexOf("success") !== -1 &&
                !dateRecord.indexOf(null) &&
                !dateRecord.indexOf("failed")
            ) {
                achievementStatus = "success";
            } else if (!dateRecord.indexOf("success")) {
                achievementStatus = "failed";
            } else if (new Date() < monthDateArr[i]) {
                achievementStatus = null;
            }

            monthRecord.push({
                date: monthDateArr[i].toISOString().split("T")[0],
                achievementStatus,
            });
        }

        return { recordTrophy, monthRecord };
    };

    countSuccessPlan = async (userId: number, date: string) => {
        return this.recordRepository.findAllPlanSuccess(userId, date);
    };
}

export default RecordService;
