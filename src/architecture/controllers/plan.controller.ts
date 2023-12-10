import { NextFunction, Request, Response } from "express";
import PlanService from "../services/plan.service";

class PlanController {
    planService = new PlanService();

    createPlan = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        //dummy data
        const userId = 1;

        const { bookId, startDate, endDate } = request.body;

        const createPlan = await this.planService.createPlan(
            userId,
            bookId,
            startDate,
            endDate,
        );

        //성공 시 status(201).json(data)
        return response.status(201).json({ data: createPlan });

        //데이터 값 오류 status(400).json({message : ???})
    };
}

export default PlanController;
