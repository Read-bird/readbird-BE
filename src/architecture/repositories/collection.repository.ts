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

    findFirstCharacter = async () => {
        return this.characterModel.findOne({
            where: { characterId: 1 },
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
}

export default CollectionRepository;
