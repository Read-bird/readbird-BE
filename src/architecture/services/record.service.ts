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

        if (plan["records.status"] !== null)
            throw new Error("Bad Request : 이미 오늘의 달성을 등록하였습니다.");

        await this.recordRepository.createRecord(userId, planId, today, status);

        const updateCurrentPage =
            currentPage >= plan.totalPage ? plan.totalPage : currentPage;

        let planStatus = plan.status;

        if (status === "success" && currentPage >= plan.totalPage)
            planStatus = "success";
        if (
            status === "failed" &&
            today === new Date(plan.endDate).toISOString().split("T")[0]
        )
            planStatus = "failed";

        const endDate = currentPage >= plan.totalPage ? today : plan.endDate;

        await this.recordRepository.updatePlan(
            planId,
            updateCurrentPage,
            planStatus,
            endDate,
        );

        const updatedPlan = await this.recordRepository.findOnePlanById(
            planId,
            userId,
            today,
        );

        let newCharacter;

        if (updatedPlan.status === "success") {
            const NORMAL_CHARACTER_KEY_ARR = [
                2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
            ];
            const EVENT_CHARACTERS_KEY_ARR = [
                ...NORMAL_CHARACTER_KEY_ARR,
                16,
                17,
                18,
            ];
            let characterId = 0;
            let newCharacter;

            const isEvent = new Date() < new Date("2024-02-29");

            const userCollection =
                await this.recordRepository.findOneCollectionByUserId(userId);

            if (userCollection === null)
                throw new Error(
                    "Bad Request : 아직 첫 캐릭터를 얻지 않았습니다. 확인이 필요합니다.",
                );

            let collectionContents = JSON.parse(userCollection.contents);

            const userNotGetCharacterArr = (
                isEvent ? EVENT_CHARACTERS_KEY_ARR : NORMAL_CHARACTER_KEY_ARR
            ).filter((characterId) =>
                collectionContents.findIndex(
                    (content: any) => content.characterId === characterId,
                ),
            );

            if (!userNotGetCharacterArr.length) {
                newCharacter = {
                    message: "더이상 새로운 캐릭터를 얻을 수 없습니다.",
                };
            } else {
                let i = 0;

                while (i === 10000) {
                    const randomNum = Math.floor(
                        Math.random() * userNotGetCharacterArr.length,
                    );

                    characterId = userNotGetCharacterArr[randomNum];

                    if (characterId !== 1) {
                        newCharacter =
                            await this.recordRepository.findNewCharacter(
                                characterId,
                            );

                        await this.recordRepository.updateCollection(
                            userId,
                            JSON.stringify([
                                ...collectionContents,
                                {
                                    characterId: newCharacter.characterId,
                                    name: newCharacter.name,
                                    imageUrl: newCharacter.imageUrl,
                                    content: newCharacter.content,
                                    getDate: new Date()
                                        .toISOString()
                                        .split("T")[0],
                                },
                            ]),
                        );

                        break;
                    }
                }
            }
        }

        return { planStatus: updatedPlan.status, newCharacter };
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
                dateRecord.indexOf(null) === -1 &&
                dateRecord.indexOf("failed") === -1
            ) {
                achievementStatus = "success";
            } else if (
                new Date() < monthDateArr[i] ||
                dateRecord.length === 0
            ) {
                achievementStatus = null;
            } else if (dateRecord.indexOf("success") === -1) {
                achievementStatus = "failed";
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
