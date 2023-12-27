import {
    Book,
    Collection,
    Plan,
    User,
    Character,
} from "../../db/models/domain/Tables";

const getUserByEmail = async (email: any) => {
    return await User.findOne({
        attributes: ["userId", "email", "nickName", "imageUrl"],
        where: {
            email: email,
        },
    });
};

const signUp = async (email: any, nickName: any, imageUrl: any) => {
    return await User.create({
        email: email,
        nickName: nickName,
        imageUrl: imageUrl,
    });
};

const getCollection = async (userId: number) => {
    const character1: string | any = await Character.findOne({
        attributes: ["characterId", "name", "content", "imageUrl"],
        where: {
            characterId: 1,
        },
    });
    const getDate: string = new Date().toISOString().split("T")[0];

    const newCharacter = {
        characterId: character1.character1,
        name: character1.name,
        content: character1.content,
        imageUrl: character1.imageUrl,
        getDate: getDate,
    };

    const array = [];
    array.push(newCharacter);
    const strCharacter1: string | any = JSON.stringify(array);

    //컬렉션에 첫 가입 캐릭터 생성
    await Collection.create({
        contents: strCharacter1,
        UserUserId: userId,
    });

    return newCharacter;
};

const findUserById = async (userId: number) => {
    return User.findOne({
        where: {
            userId,
        },
        attributes: ["userId", "email", "nickName", "imageUrl"],
        raw: true,
    });
};

const getPlanBySuccess = async (
    userId: number,
    page: number,
    scale: number,
) => {
    return Plan.findAndCountAll({
        include: {
            model: Book,
            required: false,
        },
        where: {
            userId,
            status: "success",
        },
        raw: true,
        offset: (page - 1) * scale,
        limit: Number(scale),
        attributes: ["planId", "startDate", "endDate"],
        order: [["planId", "desc"]],
    });
};

const findAllPlanByUserId = async (userId: number) => {
    return Plan.findAll({
        where: {
            userId,
        },
        raw: true,
    });
};

const deletePlan = async (userId: number, planId: number) => {
    return Plan.update(
        {
            status: "delete",
        },
        {
            where: {
                userId,
                planId,
            },
        },
    );
};

const findOnePlanById = async (userId: number, planId: number) => {
    return Plan.findOne({
        where: {
            userId,
            planId,
        },
        raw: true,
    });
};

const restorePlan = async (userId: number, planId: number, status: string) => {
    return Plan.update(
        {
            status,
        },
        {
            where: {
                planId,
                userId,
                status: "delete",
            },
        },
    );
};

const findPlanByDelete = async (userId: number) => {
    return Plan.findAll({
        include: {
            model: Book,
            attributes: [
                "bookId",
                "title",
                "author",
                "description",
                "coverImage",
                "isbn",
            ],
            required: false,
        },
        where: {
            userId,
            status: "delete",
        },
        raw: true,
        attributes: [
            "planId",
            "startDate",
            "endDate",
            "totalPage",
            "currentPage",
        ],
        order: [
            ["updatedAt", "desc"],
            ["planId", "desc"],
        ],
    });
};

const userSecession = async (userId: number, email: String | any) => {
    return User.update(
        {
            email: email,
            nickName: "delete",
            imageUrl: "delete",
        },
        {
            where: {
                userId,
            },
        },
    );
};

const planValidation = async (userId: number) => {
    const result = await Plan.findAndCountAll({
        where: {
            userId: userId,
            status: "inProgress",
        },
    });
    return result.count;
};

const bookValidation = async (bookId: number, userId: number) => {
    return Plan.findOne({
        where: {
            bookId: bookId,
            userId: userId,
            status: ["inProgress", "Success"],
        },
    });
};

export default {
    getUserByEmail,
    signUp,
    getCollection,
    findUserById,
    getPlanBySuccess,
    findAllPlanByUserId,
    deletePlan,
    findOnePlanById,
    restorePlan,
    findPlanByDelete,
    userSecession,
    planValidation,
    bookValidation,
};
