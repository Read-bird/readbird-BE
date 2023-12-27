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
        /* #swagger.parameters['Authorization'] = {
            in: "header",                            
            description: "Authorization",                   
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
                currentPage : 100,
                publisher : 'publisher',
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
        /* #swagger.parameters['Authorization'] = {
            in: "header",                            
            description: "Authorization",                   
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
                        publisher : 'publisher',
                        totalPage : 100,
                        currentPage : 60,
                        target : 30,
                        startDate : '2023-12-10',
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

    updatePlan = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        //  #swagger.description = '플랜의 종료일을 수정할 수 있습니다.'
        //  #swagger.tags = ['Plan']
        /* #swagger.parameters['Authorization'] = {
            in: "header",                            
            description: "Authorization",                   
            required: true,                     
            type: "string"         
        } */
        /* #swagger.parameters[""] = {
            in: "body",                            
            description: "변경할 종료일",    
            schema : { endDate : "2023-12-25"}
        } */
        /*  #swagger.responses[200] = {
            description: '플랜 수정 완료',
            schema: {    
                "planId": 5,
                "totalPage": 900,
                "currentPage": 0,
                "status": "inProgress",
                "startDate": "2023-12-09T00:00:00.000Z",
                "endDate": "2023-12-17T00:00:00.000Z",
                "createdAt": "2023-12-15T11:19:58.000Z",
                "updatedAt": "2023-12-15T11:30:15.000Z",
                "userId": 1,
                "bookId": 1
            }
        }*/
        /*  #swagger.responses[400] = {
            description: '값이 알맞게 들어오지 않을 경우',
        }*/
        /*  #swagger.responses[404] = {
            description: '플랜을 찾을 수 없는 경우',
        }*/
        try {
            const { userId, endDate }: { userId: number; endDate: string } =
                request.body;
            const { planId } = request.params;

            const updatePlan = await this.planService.updatePlan(
                userId,
                planId,
                endDate,
            );
            response.status(200).json(updatePlan);
        } catch (error) {
            next(error);
        }
    };

    deletePlan = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        //  #swagger.description = '플랜을 삭제할 수 있습니다..'
        //  #swagger.tags = ['Plan']
        /* #swagger.parameters['Authorization'] = {
            in: "header",                            
            description: "Authorization",                   
            required: true,                     
            type: "string"         
        } */
        /*  #swagger.responses[200] = {
            description: '플랜 삭제 완료'
        }*/
        /*  #swagger.responses[400] = {
            description: '값이 알맞게 들어오지 않을 경우',
        }*/
        /*  #swagger.responses[404] = {
            description: '플랜을 찾을 수 없는 경우',
        }*/
        try {
            const { userId }: { userId: number } = request.body;
            const { planId } = request.params;

            await this.planService.deletePlan(userId, planId);

            response
                .status(200)
                .json({ message: "플랜 삭제에 성공하였습니다." });
        } catch (error) {
            next(error);
        }
    };

    extendPlan = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        //  #swagger.description = '플랜을 연장 할 수 있습니다.'
        //  #swagger.tags = ['Plan']
        /* #swagger.parameters['Authorization'] = {
            in: "header",                            
            description: "Authorization",                   
            required: true,                     
            type: "string"         
        } */
        /* #swagger.parameters['data'] = {
            in: "body",                            
            description: "등록 할 플랜의 정보",                   
            required: true,                     
            type: "object",
            schema : 
                [
                    {
                        planId : 1,
                        endDate : '2023-12-28'
                    }
                ]
            
        } */
        /*  #swagger.responses[201] = {
            description: '플랜 연장 성공',
            schema: 
                [
                    {
                        planId : 1,
                        title : 'title',
                        author : 'author',
                        coverImage : 'url',
                        publisher : 'publisher',
                        startDate : '2023-12-29',
                        endDate : '2023-12-29',
                        currentPage : 200,
                        totalPage : 300,
                        target : 3,
                        status : 'inProgress'
                    },
                    {
                        planId: 2,
                        message: "플랜을 찾을 수 없습니다.",
                    }
                ]
            
        }*/
        /*  #swagger.responses[400] = {
            description: '값이 알맞게 들어오지 않을 경우',
        }*/
        try {
            const { userId, extendData } = request.body;

            const extendPlans = await this.planService.extendPlan(
                userId,
                extendData,
            );

            response.status(201).json(extendPlans);
        } catch (error) {
            next(error);
        }
    };
}

export default PlanController;
