import { NextFunction, Request, Response } from "express";
import CollectionService from "../services/collection.service";

class CollectionController {
    collectionService = new CollectionService();

    createCollection = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        //  #swagger.description = '플랜 생성 축하 캐릭터가 추가됩니다.'
        //  #swagger.tags = ['Collection']
        /* #swagger.parameters['Authorization'] = {
            in: "header",                            
            description: "Authorization",                   
            required: true,                     
            type: "string"         
        } */
        /*  #swagger.responses[201] = {
            description: '첫 캐릭터 등록 성공',
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

            const newCollection =
                await this.collectionService.createCollection(userId);

            response.status(201).json(newCollection);
        } catch (error) {
            next(error);
        }
    };

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

    updateCollection = async (
        request: Request,
        response: Response,
        next: NextFunction,
    ) => {
        //  #swagger.description = '새로운 캐릭터를 추가 할 수 있습니다.'
        //  #swagger.tags = ['Collection']
        /* #swagger.parameters['Authorization'] = {
            in: "header",                            
            description: "Authorization",                   
            required: true,                     
            type: "string"         
        } */
        /*  #swagger.responses[200] = {
            description: '캐릭터 추가 성공',
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
}

export default CollectionController;
