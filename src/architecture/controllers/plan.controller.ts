import { NextFunction, Request, Response } from "express";
import PlanService from "../services/plan.service";

//dummy data
const userId = 1;

class PlanController {
    planService = new PlanService();

    createPlan = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        //  #swagger.description = '플랜 등록'
        //  #swagger.tags = ['Plans']
        /*  #swagger.parameters[''] = {
                        in: 'body',
                        schema: {
                            "bookId" : 7,
                            "startDate" : "2023-12-12",
                            "endDate" : "2023-12-30",
                            "title" : "title",
                            "author" : "author",
                            "totalPage" : 100
                        }
        } */
        /*  #swagger.responses[201] = {
                    description: '플랜 등록 성공',
                    schema: {
                        planId : 1,
                        title : 'title',
                        author : 'author',
                        coverImage : 'url' || null,
                        totalPage : 100,
                        target : 30,
                        status : 'inProgress'
                    }
        } */
        /*  #swagger.responses[400] = {
                    description: 'body 또는 params를 입력받지 못한 경우',
        } */
        try {
            const createPlan = await this.planService.createPlan({
                userId,
                body: request.body,
            });

            return response.status(201).json(createPlan);
        } catch (error) {
            next(error);
        }
    };

    findAllPlansByDate = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        //  #swagger.description = 플랜 조회'
        //  #swagger.tags = ['Plans']
        /*  #swagger.parameters[''] = {
                        in: 'body',
                        schema: {
                            "date" : "2023-12-12"
                        }
        } */
        /*  #swagger.responses[200] = {
                    description: '플랜 조회 성공',
                    schema: {
                        "weedRecord": [
                            {
                                "date": "2023-12-10",
                                "achievementStatus": "failed"
                            }
                        ],
                        "planData": [
                            {
                                "planId": 1,
                                "title": 1,
                                "author": "베르나르 베르베르 지음, 이세욱 옮김",
                                "coverImage": "http://image.aladin.co.kr/product/3213/68/coversum/8932916373_2.jpg",
                                "totalPage": 100,
                                "currentPage": 60,
                                "target": 30,
                                "endDate": "2023-12-29T15:00:00.000Z",
                                "planStatus": "failed",
                                "recordStatus": "success"
                            }
                        ],
                        "previouslyFailedPlan": [
                            {
                                "planId": 5,
                                "totalPage": 900,
                                "currentPage": 0,
                                "status": "inProgress",
                                "startDate": "2023-12-09T00:00:00.000Z",
                                "endDate": "2023-12-11T00:00:00.000Z",
                                "createdAt": "2023-12-13T19:00:19.000Z",
                                "updatedAt": "2023-12-13T19:00:19.000Z",
                                "userId": 1,
                                "bookId": 1
                            }
                        ]
                    }
        } */
        try {
            const userId = 1;

            const { date }: { date: string } = request.body;

            const weedRecord = await this.planService.weedRecord(userId, date);

            const planData = await this.planService.findAllPlansByDate(
                userId,
                date,
            );

            const previouslyFailedPlan =
                await this.planService.previouslyFailedPlans(userId);

            return response.status(200).json({
                weedRecord,
                planData,
                previouslyFailedPlan: previouslyFailedPlan,
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };
}

export default PlanController;
