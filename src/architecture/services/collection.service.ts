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
        const currentCollection =
            await this.collectionRepository.findOneCollectionByUserId(userId);

        if (currentCollection)
            throw new Error(
                "Bad Request : 이미 첫번째 캐릭터를 얻은 유저입니다.",
            );

        const newCollection =
            await this.collectionRepository.findFirstCharacter();

        const createCollection =
            await this.collectionRepository.createCollection(
                userId,
                JSON.stringify([newCollection]),
            );

        return {
            collectionId: createCollection.collectionId,
            contents: JSON.parse(createCollection.contents),
        };
    };
}

export default BookService;
