import PlanRepository from "../repositories/plan.repository";
import { Book, Plan, Record } from "../../db/models/domain/Tables";
import getDateFormat from "../../util/setDateFormat";
import makeWeekArr from "../../util/makeWeekArr";
import getPlanTarget from "../../util/getPlanTarget";

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

        let bookData = await this.planRepository.findOneBook(newBookId);

        if (bookData === null) {
            const { title, author, totalPage, publisher } = body;

            bookData = {
                title,
                author,
                totalPage,
                publisher,
                description: null,
                isbn: null,
                coverImage: null,
                pubDate: null,
            };

            const newBookData = await this.planRepository.createBook(bookData);

            newBookId = newBookData.bookId;
            newTotalPage = totalPage;
        } else {
            newTotalPage = bookData.totalPage;
        }

        const { planId } = body;

        if (planId) {
            await this.planRepository.restorePlan(planId);
        }

        const newPlan = await this.planRepository.createPlan(
            newTotalPage,
            newStartDate,
            newEndDate,
            userId,
            newBookId,
            currentPage,
        );

        const target = getPlanTarget(
            newPlan.endDate,
            newPlan.totalPage,
            newPlan.currentPage,
        );

        return {
            planId: newPlan.planId,
            title: bookData.title,
            author: bookData.author,
            coverImage: bookData.coverImage,
            publisher: bookData.publisher,
            totalPage: bookData.totalPage,
            target,
            status: newPlan.status,
        };
    };

    findAllPlansByDate = async (userId: number, date: string) => {
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
                startDate: Date;
                endDate: Date;
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
                "Book.publisher": string;
            }) => {
                const target = getPlanTarget(
                    plan.endDate,
                    plan.totalPage,
                    plan.currentPage,
                );

                let recordStatus = plan["records.status"];

                if (plan["records.status"] === null) {
                    recordStatus =
                        getDateFormat(new Date()) <= date
                            ? "inProgress"
                            : "failed";
                }

                return {
                    planId: plan.planId,
                    title: plan["Book.title"],
                    author: plan["Book.author"],
                    coverImage: plan["Book.coverImage"],
                    publisher: plan["Book.publisher"],
                    totalPage: plan.totalPage,
                    currentPage: plan.currentPage,
                    target: plan.status === "inProgress" ? target : 0,
                    startDate: plan.startDate,
                    endDate: plan.endDate,
                    planStatus: plan.status,
                    recordStatus,
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

        return previousPlans.map((plan: any) => {
            return {
                planId: plan.planId,
                title: plan["Book.title"],
                author: plan["Book.author"],
                coverImage: plan["Book.coverImage"],
                publisher: plan["Book.publisher"],
                totalPage: plan.totalPage,
                currentPage: plan.currentPage,
                startDate: plan.startDate,
                endDate: plan.endDate,
            };
        });
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
            } else if (new Date() < weekDateArr[i] || dateRecord.length === 0) {
                achievementStatus = null;
            } else if (dateRecord.indexOf("success") === -1) {
                achievementStatus = "failed";
            }

            weedPlans.push({
                date: getDateFormat(weekDateArr[i]),
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
        if (plan.status === "success")
            throw new Error("Bad Request : 성공한 플랜은 수정할 수 없습니다.");
        if (plan.status === "delete")
            throw new Error("Bad Request : 이미 삭제한 플랜입니다.");

        await this.planRepository.updatePlan(userId, plan.planId, endDate);

        const newPlan = await this.planRepository.findOnePlanById(planId);

        const target = getPlanTarget(
            newPlan.endDate,
            newPlan.totalPage,
            newPlan.currentPage,
        );

        return {
            planId: newPlan.planId,
            title: newPlan["Book.title"],
            author: newPlan["Book.author"],
            coverImage: newPlan["Book.coverImage"],
            publisher: newPlan["Book.publisher"],
            totalPage: newPlan.totalPage,
            currentPage: newPlan.currentPage,
            target: newPlan.status === "inProgress" ? target : 0,
            startDate: newPlan.startDate,
            endDate: newPlan.endDate,
            planStatus: newPlan.status,
        };
    };

    deletePlan = async (userId: number, planId: any) => {
        const plan = await this.planRepository.findOnePlanById(planId);

        if (plan === null)
            throw new Error("Not Found : 플랜을 찾을 수 없습니다.");
        if (plan.status === "delete")
            throw new Error("Bad Request :이미 삭제 된 플랜입니다.");
        if (plan.status === "failed")
            throw new Error("Bad Request : 실패한 플랜은 삭제할 수 없습니다.");
        if (plan.status === "success")
            throw new Error("Bad Request : 성공한 플랜은 할 수 없습니다.");

        const deletePlan = await this.planRepository.deletePlan(userId, planId);

        return deletePlan;
    };

    extendPlan = async (userId: number, extendData: any) => {
        if (extendData.length === 0)
            throw new Error("Bad Request : 연장할 플랜 데이터가 없습니다.");

        let extendPlans: any = [];

        for (let i = 0; i < extendData.length; i++) {
            const oldPlan = await this.planRepository.findOnePlanById(
                extendData[i].planId,
            );

            if (oldPlan === null)
                extendPlans.push = {
                    planId: extendData[i].planId,
                    message: "플랜을 찾을 수 없습니다.",
                };

            const newPlan = await this.planRepository.createPlan(
                oldPlan.totalPage,
                oldPlan.startDate,
                extendData[i].endDate,
                userId,
                oldPlan.bookId,
                oldPlan.currentPage,
            );

            const bookData = await this.planRepository.findOneBook(
                newPlan.bookId,
            );

            const target = getPlanTarget(
                newPlan.endDate,
                newPlan.totalPage,
                newPlan.currentPage,
            );

            extendData.push = {
                planId: newPlan.planId,
                startDate: newPlan.startDate,
                endDate: newPlan.endDate,
                title: bookData.title,
                author: bookData.author,
                coverImage: bookData.coverImage,
                publisher: bookData.publisher,
                currentPage: newPlan.currentPage,
                totalPage: newPlan.totalPage,
                target,
                status: newPlan.status,
            };
        }

        return extendData;
    };
}

export default PlanService;
