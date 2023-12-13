import PlanRepository from "../repositories/plan.repository";
// import { Book } from "../../db/models/domain/Book";
// import { Plan } from "../../db/models/domain/Plan";
// import { Record } from "../../db/models/domain/Record";
import { Book, Plan, Record } from "../../db/models/domain/Tables";
class PlanService {
    planRepository: PlanRepository;

    constructor() {
        this.planRepository = new PlanRepository(Plan, Book, Record);
    }

    createPlan = async ({ userId, body }: { userId: number; body: any }) => {
        const { bookId, startDate, endDate } = body;
        let newTotalPage;
        let newBookId = bookId;

        const dateForm = RegExp(
            /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/,
        );

        if (!dateForm.test(startDate) || !dateForm.test(endDate)) {
            throw new Error(
                "Bad Request : 올바르지않은 날짜 형식입니다. 형식은 yyyy-mm-dd 입니다.",
            );
        }
        const newStartDate = new Date(startDate);
        const newEndDate = new Date(endDate);

        const userInProgressPlan =
            await this.planRepository.getInProgressPlan(userId);

        if (userInProgressPlan.length > 3) {
            throw Error("Bad Request : 지금 진행중인 플랜이 3개 이상입니다.");
        }

        const bookData = await this.planRepository.findOneBook(bookId);

        if (bookData === null) {
            const { title, author, totalPage } = body;

            const newBook = {
                title,
                author,
                totalPage,
                description: null,
                isbn: null,
                coverImage: null,
                publisher: null,
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
        );
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
            }) => {
                return {
                    planId: plan.planId,
                    title: plan["Book.bookId"],
                    author: plan["Book.author"],
                    coverImage: plan["Book.coverImage"],
                    totalPage: 100,
                    currentPage: 60,
                    target: 30,
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
        for (let i = -3; i < 4; i++) {
            let achievementStatus: string | null = "failed";
            let baseDate = new Date(
                new Date(date).setDate(new Date(date).getDate() + i),
            );
            const findAllPlansByDate = await this.planRepository.getTodayPlans(
                userId,
                baseDate,
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
            } else if (new Date() < baseDate) {
                achievementStatus = null;
            }

            weedPlans.push({
                date: baseDate.toISOString().split("T")[0],
                achievementStatus,
            });
        }
        return weedPlans;
    };
}

export default PlanService;
