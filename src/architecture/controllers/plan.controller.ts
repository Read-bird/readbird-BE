import { NextFunction, Request, Response } from "express";
import PlanService from "../services/plan.service";

class PlanController {
    planService = new PlanService();

    createPlan = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        //  #swagger.description = '플랜을 등록 할 수 있습니다.'
        //  #swagger.tags = ['Plan']
        /* #swagger.parameters['authorization'] = {
            in: "header",                            
            description: "accessToken",                   
            required: true,                     
            type: "string"         
        } */
        /* #swagger.parameters['data'] = {
            in: "body",                            
            description: "등록 할 플랜의 정보",                   
            required: true,                     
            type: "object",
            schema : {
                planId : 1,
                title : 'title' || null,
                author : 'author' || null,
                totalPage : 100 || null,
                startDate : '2023-12-12',
                endDate : '2023-12-30'
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
        }*/
        /*  #swagger.responses[400] = {
            description: '값이 알맞게 들어오지 않을 경우',
        }*/
        try {
            const { userId } = request.body;

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
        //  #swagger.description = '해당 일자의 플랜 리스트를 조회 할 수 있습니다.'
        //  #swagger.tags = ['Plan']
        /* #swagger.parameters['authorization'] = {
            in: "header",                            
            description: "accessToken",                   
            required: true,                     
            type: "string"         
        } */
        /* #swagger.parameters['date'] = {
            in: "query",                            
            description: "조회 할 일자",                   
            required: true,                     
            type: "string",
            example : "2023-12-15"
        } */
        /*  #swagger.responses[200] = {
            description: '일자별 플랜 리스트 조회 성공',
            schema: {
                weedRecord : [
                    { 
                        date : '2023-12-12',
                        achievementStatus : 'success'
                    }
                ],
                planData : [
                    { 
                        planId : 1,
                        title : 'title',
                        author : 'author',
                        coverImage : 'url',
                        totalPage : 100,
                        currentPage : 60,
                        target : 30,
                        endDate : '2023-12-30',
                        planStatus : 'success',
                        recordStatus : 'success',
                    }
                ],
                previouslyFailedPlan : [
                    { 
                        planId : 1,
                        title : 'title',
                        author : 'author',
                        coverImage : 'url',
                        totalPage : 100,
                        currentPage : 60,
                        endDate : '2023-12-30'
                    }
                ]
            }
        }*/
        /*  #swagger.responses[400] = {
            description: '값이 알맞게 들어오지 않을 경우',
        }*/
        try {
            const { userId } = request.body;

            const { date }: any = request.query;

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
