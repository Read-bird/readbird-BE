import { NextFunction, Request, Response } from "express";
import CollectionService from "../services/collection.service";

class CollectionController {
    collectionService = new CollectionService();

    getCollection = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        //  #swagger.description = '도감을 조회할 수 있습니다.'
        //  #swagger.tags = ['Collection']
        /* #swagger.parameters['Authorization'] = {
            in: "header",                            
            description: "Authorization",                   
            required: true,                     
            type: "string"         
        } */
        /*  #swagger.responses[200] = {
            description: '도감 조회 성공',
            schema: 
                [
                    {
                        "characterId":1,"name":"베이비버드",
                        "content":"플랜을 처음 등록하면 개방되는 짹짹이",
                        "imageUrl":"https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png"
                    }
                ]
        }*/
        try {
            const { userId } = request.body;

            const userCollection =
                await this.collectionService.getCollection(userId);

            response.status(200).json(userCollection);
        } catch (error) {
            next(error);
        }
    };

    getEventCharacter = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        //  #swagger.description = '이벤트 캐릭터를 추가 할 수 있습니다.'
        //  #swagger.tags = ['Collection']
        /* #swagger.parameters['Authorization'] = {
            in: "header",                            
            description: "Authorization",                   
            required: true,                     
            type: "string"         
        } */
        /*  #swagger.responses[200] = {
            description: '이벤트 캐릭터 추가 성공',
            schema: 
                    {
                        "characterId":1,"name":"베이비버드",
                        "content":"플랜을 처음 등록하면 개방되는 짹짹이",
                        "imageUrl":"https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png"
                    }
        }*/
        try {
            const { userId } = request.body;

            const newCharacter =
                await this.collectionService.updateCollection(userId);

            response.status(200).json(newCharacter);
        } catch (error) {
            next(error);
        }
    };

    getNewCharacter = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        //  #swagger.description = '달성 등록 시 캐릭터를 얻지 못했을 경우 새로운 캐릭터를 얻을 수 있습니다.'
        //  #swagger.tags = ['Collection']
        /* #swagger.parameters['Authorization'] = {
            in: "header",                            
            description: "Authorization",                   
            required: true,                     
            type: "string"         
        } */
        /*  #swagger.responses[200] = {
            description: '새로운 캐릭터 추가 성공',
            schema: 
                    {
                        "characterId":1,"name":"베이비버드",
                        "content":"플랜을 처음 등록하면 개방되는 짹짹이",
                        "imageUrl":"https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png"
                    }
        }*/
        try {
            const { userId } = request.body;

            const getNewCharacter =
                await this.collectionService.getNewCharacter(userId);

            response.status(200).json(getNewCharacter);
        } catch (error) {
            next(error);
        }
    };
}

export default CollectionController;
