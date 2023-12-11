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

        try {
            const createPlan = await this.planService.createPlan({
                userId,
                body: request.body,
            });

            return response.status(201).json({ data: createPlan });
        } catch (error) {
            next(error);
        }
    };
}

export default PlanController;
