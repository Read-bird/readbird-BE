import { NextFunction, Request, Response } from "express";
import CollectionService from "../services/collection.service";

class CollectionController {
    collectionService = new CollectionService();

    createCollection = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        try {
            const { userId } = request.body;

            const newCollection =
                await this.collectionService.createCollection(userId);

            response.status(201).json(newCollection);
        } catch (error) {
            next(error);
        }
    };
}

export default CollectionController;
