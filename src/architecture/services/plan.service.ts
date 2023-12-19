import PlanRepository from "../repositories/plan.repository";
import { Book, Plan, Record } from "../../db/models/domain/Tables";
import getDateFormat from "../../util/setDateFormat";
import makeWeekArr from "../../util/makeWeekArr";

const dateForm = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);

class PlanService {
    planRepository: PlanRepository;

    constructor() {
        this.planRepository = new PlanRepository(Plan, Book, Record);
    }

    createPlan = async ({ userId, body }: { userId: number; body: any }) => {
        const { bookId, startDate, endDate, currentPage } = body;
        let newTotalPage;
        let newBookId = bookId || 0;

        const userInProgressPlan =
            await this.planRepository.getInProgressPlan(userId);

        if (userInProgressPlan.length > 2) {
            throw Error("Bad Request : 지금 진행중인 플랜이 3개 이상입니다.");
        }

        if (!dateForm.test(startDate) || !dateForm.test(endDate)) {
            throw new Error(
                "Bad Request : 올바르지않은 날짜 형식입니다. 형식은 yyyy-mm-dd 입니다.",
            );
        }
        const newStartDate = new Date(startDate);
        const newEndDate = new Date(endDate);

        const bookData = await this.planRepository.findOneBook(newBookId);

        if (bookData === null) {
            const { title, author, totalPage, publisher } = body;

            const newBook = {
                title,
                author,
                totalPage,
                publisher,
                description: null,
                isbn: null,
                coverImage: null,
                pubDate: null,
            };

            const newBookData = await this.planRepository.createBook(newBook);

            newBookId = newBookData.bookId;
            newTotalPage = totalPage;
        } else {
            newTotalPage = bookData.totalPage;
        }

        return this.planRepository.createPlan(
            newTotalPage,
            newStartDate,
            newEndDate,
            userId,
            newBookId,
            currentPage,
        );
    };

    findAllPlansByDate = async (userId: number, date: string) => {
        const today: any = new Date();
        const baseDate: Date = new Date(date);

        const getTodayPlan = await this.planRepository.getTodayPlans(
            userId,
            baseDate,
        );

        return getTodayPlan.map(
            (plan: {
                planId: number;
                totalPage: number;
                currentPage: number;
                status: string;
                startDate: string;
                endDate: string;
                createdAt: Date;
                updatedAt: Date;
                userId: number;
                bookId: number;
                "records.status": string;
                "records.successAt": string;
                "Book.coverImage": string;
                "Book.isbn": string;
                "Book.description": string;
                "Book.author": string;
                "Book.title": string;
                "Book.bookId": number;
            }) => {
                const masDate: any = new Date(plan.endDate);

                const target = Math.floor(
                    (plan.totalPage - plan.currentPage) /
                        Math.floor((masDate - today) / (1000 * 60 * 60 * 24)),
                );

                return {
                    planId: plan.planId,
                    title: plan["Book.bookId"],
                    author: plan["Book.author"],
                    coverImage: plan["Book.coverImage"],
                    totalPage: plan.totalPage,
                    currentPage: plan.currentPage,
                    target,
                    endDate: plan.endDate,
                    planStatus: plan.status,
                    recordStatus: plan["records.status"],
                };
            },
        );
    };

    previouslyFailedPlans = async (userId: number) => {
        const previousPlans =
            await this.planRepository.getInProgressPlans(userId);

        for (let i = 0; i < previousPlans.length; i++) {
            await this.planRepository.updateInProgressPlans(
                previousPlans[i].planId,
                userId,
                "failed",
            );
        }

        return previousPlans;
    };

    weedRecord = async (userId: number, date: string) => {
        let weedPlans = [];
        const weekDateArr = makeWeekArr(new Date(date));

        for (let i = 0; i < 7; i++) {
            let achievementStatus: string | null = "failed";

            const findAllPlansByDate = await this.planRepository.getTodayPlans(
                userId,
                weekDateArr[i],
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
            } else if (new Date() < weekDateArr[i]) {
                achievementStatus = null;
            }

            weedPlans.push({
                date: weekDateArr[i].toISOString().split("T")[0],
                achievementStatus,
            });
        }
        return weedPlans;
    };

    updatePlan = async (userId: number, planId: any, endDate: string) => {
        if (!dateForm.test(endDate)) {
            throw new Error(
                "Bad Request : 올바르지않은 날짜 형식입니다. 형식은 yyyy-mm-dd 입니다.",
            );
        }

        if (endDate < getDateFormat(new Date()))
            throw new Error(
                "Bad Request : 종료일은 오늘보다 빠를 수 없습니다.",
            );

        const plan = await this.planRepository.findOnePlanById(planId);

        if (plan === null)
            throw new Error("Not Found : 플랜을 찾을 수 없습니다.");
        if (plan.status === "failed")
            throw new Error("Bad Request : 실패한 플랜은 수정할 수 없습니다.");

        await this.planRepository.updatePlan(userId, plan.planId, endDate);

        return this.planRepository.findOnePlanById(planId);
    };

    deletePlan = async (userId: number, planId: any) => {
        const plan = await this.planRepository.findOnePlanById(planId);

        if (plan === null)
            throw new Error("Not Found : 플랜을 찾을 수 없습니다.");
        if (plan.status === "delete")
            throw new Error("Bad Request :이미 삭제 된 플랜입니다.");

        const deletePlan = await this.planRepository.deletePlan(userId, planId);

        console.log(deletePlan);

        return deletePlan;
    };
}

export default PlanService;
