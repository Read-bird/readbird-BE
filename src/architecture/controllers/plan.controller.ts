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
