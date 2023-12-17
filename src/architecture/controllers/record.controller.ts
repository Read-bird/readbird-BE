import { NextFunction, Request, Response } from "express";
import RecordService from "../services/record.service";

class RecordController {
    recordService = new RecordService();

    changeRecord = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        //  #swagger.description = '오늘의 플랜 달성을 변경할 수 있습니다.'
        //  #swagger.tags = ['Record']
        /* #swagger.parameters['Authorization'] = {
            in: "header",                            
            description: "Authorization",                   
            required: true,                     
            type: "string"         
        } */
        /* #swagger.parameters['data'] = {
            in: "body",                            
            description: "업데이트 할 목표 데이터",                   
            schema : {
                "status" : "success",
                "currentPage" : 300
            }      
        } */
        /*  #swagger.responses[200] = {
            description: '목표 달성 성공, 플랜 달성 성공여부',
            schema: {
                "message": "plan.status = success"
            }
        }*/
        /*  #swagger.responses[404] = {
            description: '플랜이 없는 경우',
        }*/
        /*  #swagger.responses[400] = {
            description: '플랜이 이미 성공, 실패, 삭제 된 경우, 변경할 recordStatus가 동일 한 경우',
        }*/
        try {
            const { planId } = request.params;
            const { userId, status, currentPage } = request.body;

            const changeRecord = await this.recordService.changeRecord(
                Number(planId),
                userId,
                status,
                currentPage,
            );

            response.status(200).json({
                message: changeRecord
                    ? "plan.status = success"
                    : "plan.status = inProgress",
            });
        } catch (error) {
            next(error);
        }
    };
}

export default RecordController;
