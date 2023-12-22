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

    createCollection = async (userId: number, contents: string) => {
        return this.collectionModel.create({
            UserUserId: userId,
            contents,
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
}

export default CollectionRepository;
