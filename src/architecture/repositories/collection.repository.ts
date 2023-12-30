import { Op } from "sequelize";

class CollectionRepository {
    collectionModel: any;
    characterModel: any;

    constructor(Collection: any, Character: any) {
        this.collectionModel = Collection;
        this.characterModel = Character;
    }

    findOneCollectionByUserId = async (userId: number) => {
        return this.collectionModel.findOne({
            where: { UserUserId: userId },
            attributes: ["collectionId", "contents"],
            raw: true,
        });
    };

    findNewCharacter = async (characterId: number) => {
        return this.characterModel.findOne({
            where: characterId,
            attributes: ["characterId", "name", "content", "imageUrl"],
            raw: true,
        });
    };

    updateCollection = async (userId: number, contents: string) => {
        return this.collectionModel.update(
            {
                contents,
            },
            {
                where: {
                    UserUserId: userId,
                },
            },
        );
    };

    findEventCharacter = async (characterId: number) => {
        return this.characterModel.findAll({
            where: {
                characterId: {
                    [Op.gte]: characterId,
                    [Op.lte]: characterId + 2,
                },
            },
            attributes: ["characterId", "name", "content", "imageUrl"],
            raw: true,
        });
    };
}

export default CollectionRepository;
