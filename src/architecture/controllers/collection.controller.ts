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
            schema: {
                collectionId : 1,
                contents : [
                    {
                        "characterId":1,"name":"베이비버드",
                        "content":"플랜을 처음 등록하면 개방되는 짹짹이",
                        "imageUrl":"https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png"
                    }
                ]
             } 
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
}

export default CollectionController;
