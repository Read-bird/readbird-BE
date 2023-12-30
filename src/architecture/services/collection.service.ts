import { Character, Collection } from "../../db/models/domain/Tables";
import getDateFormat from "../../util/setDateFormat";
import CollectionRepository from "../repositories/collection.repository";

class BookService {
    collectionRepository: CollectionRepository;

    constructor() {
        this.collectionRepository = new CollectionRepository(
            Collection,
            Character,
        );
    }

    getCollection = async (userId: number) => {
        const userCollection =
            await this.collectionRepository.findOneCollectionByUserId(userId);

        if (userCollection === null) return [];

        return JSON.parse(userCollection.contents);
    };

    updateCollection = async (userId: number) => {
        let EVENT_CHARACTER_ID = 13;

        const userCollection =
            await this.collectionRepository.findOneCollectionByUserId(userId);

        if (userCollection === null)
            throw new Error(
                "Bad Request : 아직 첫 캐릭터를 얻지 않았습니다. 확인이 필요합니다.",
            );

        let collectionContents = JSON.parse(userCollection.contents);

        const validation = collectionContents.findIndex(
            (content: any) => content.characterId === EVENT_CHARACTER_ID,
        );

        if (validation !== -1)
            throw new Error(
                "Bad Request : 이미 이벤트 캐릭터를 획득하였습니다.",
            );

        const eventCharacter =
            await this.collectionRepository.findEventCharacter(
                EVENT_CHARACTER_ID,
            );

        const today = getDateFormat(new Date());

        const updateCharacter = eventCharacter.map((character: any) => {
            character.getDate = today;
            return character;
        });

        const updateCollection =
            await this.collectionRepository.updateCollection(
                userId,
                JSON.stringify([...collectionContents, ...updateCharacter]),
            );

        if (!updateCollection)
            throw new Error(
                "Server Error : 업데이트에 실패하였습니다. 다시 시도해주세요.",
            );

        return eventCharacter;
    };

    getNewCharacter = async (userId: number) => {
        let newCharacter;

        const NORMAL_CHARACTER_KEY_ARR = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const EVENT_CHARACTERS_KEY_ARR = [
            ...NORMAL_CHARACTER_KEY_ARR,
            16,
            17,
            18,
        ];
        let characterId = 0;

        const isEvent = new Date() < new Date("2024-02-29");

        const userCollection =
            await this.collectionRepository.findOneCollectionByUserId(userId);

        if (userCollection === null)
            throw new Error(
                "Bad Request : 아직 첫 캐릭터를 얻지 않았습니다. 확인이 필요합니다.",
            );

        let collectionContents = JSON.parse(userCollection.contents);

        const userNotGetCharacterArr = (
            isEvent ? EVENT_CHARACTERS_KEY_ARR : NORMAL_CHARACTER_KEY_ARR
        ).filter((characterId) =>
            collectionContents.findIndex(
                (content: any) => content.characterId === characterId,
            ),
        );

        if (userNotGetCharacterArr.length) {
            newCharacter = {
                message: "더이상 새로운 캐릭터를 얻을 수 없습니다.",
            };
        } else {
            let i = 0;
            while (i === 1000) {
                const randomNum = Math.floor(
                    Math.random() * userNotGetCharacterArr.length + 1,
                );

                const validation = collectionContents.findIndex(
                    (content: any) => content.characterId === randomNum,
                );

                if (validation === -1) {
                    characterId = randomNum;
                    break;
                }

                i++;
            }

            if (i > 999)
                throw new Error(
                    "While Error : 캐릭터 등록에 실패했습니다. 다시 한번 시도해주세요!",
                );

            newCharacter =
                await this.collectionRepository.findNewCharacter(characterId);

            await this.collectionRepository.updateCollection(
                userId,
                JSON.stringify([
                    ...collectionContents,
                    {
                        characterId: newCharacter.characterId,
                        name: newCharacter.name,
                        imageUrl: newCharacter.imageUrl,
                        content: newCharacter.content,
                        getDate: new Date().toISOString().split("T")[0],
                    },
                ]),
            );
        }

        return newCharacter;
    };
}

export default BookService;
