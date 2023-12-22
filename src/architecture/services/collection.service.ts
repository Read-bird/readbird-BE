import { Character, Collection } from "../../db/models/domain/Tables";
import CollectionRepository from "../repositories/collection.repository";

class BookService {
    collectionRepository: CollectionRepository;

    constructor() {
        this.collectionRepository = new CollectionRepository(
            Collection,
            Character,
        );
    }

    createCollection = async (userId: number) => {
        const NEW_CHARACTER_ID = 1;

        const currentCollection =
            await this.collectionRepository.findOneCollectionByUserId(userId);

        if (currentCollection)
            throw new Error(
                "Bad Request : 이미 첫번째 캐릭터를 얻은 유저입니다.",
            );

        const newCollection =
            await this.collectionRepository.findNewCharacter(NEW_CHARACTER_ID);

        const createCollection =
            await this.collectionRepository.createCollection(
                userId,
                JSON.stringify([newCollection]),
            );

        return JSON.parse(createCollection.contents);
    };

    getCollection = async (userId: number) => {
        const userCollection =
            await this.collectionRepository.findOneCollectionByUserId(userId);

        if (userCollection === null) return [];

        return JSON.parse(userCollection.contents);
    };

    updateCollection = async (userId: number) => {
        const NUMBER_CHARACTERS = 16;
        const userCollection =
            await this.collectionRepository.findOneCollectionByUserId(userId);

        if (userCollection === null)
            throw new Error(
                "Bad Request : 아직 첫 캐릭터를 얻지 않았습니다. 확인이 필요합니다.",
            );

        let characterId = 0;
        let collectionContents = JSON.parse(userCollection.contents);

        if (collectionContents.length >= 16)
            throw new Error(
                "Bad Request : 더이상 새로운 캐릭터를 얻을 수 없습니다.",
            );

        while (true) {
            const randomNum = Math.floor(Math.random() * NUMBER_CHARACTERS + 1);

            const validation = collectionContents.findIndex(
                (content: any) => content.characterId === randomNum,
            );

            if (validation === -1) {
                characterId = randomNum;
                break;
            }
        }

        const newCharacter =
            await this.collectionRepository.findNewCharacter(characterId);

        const updateCollection =
            await this.collectionRepository.updateCollection(
                userId,
                JSON.stringify([...collectionContents, newCharacter]),
            );

        if (!updateCollection)
            throw new Error(
                "Server Error : 업데이트에 실패하였습니다. 다시 시도해주세요.",
            );

        return newCharacter;
    };
}

export default BookService;
