import { Book, Plan, User } from "../../db/models/domain/Tables";

const getUserByEmail = async (email: any) => {
    try {
        const userSelect = await User.findOne({
            attributes: ["userId", "email", "nickName", "imageUrl"],
            where: {
                email: email,
            },
        });

        return userSelect;
    } catch (error) {}
};

const signUp = async (email: any, nickName: any, imageUrl: any) => {
    try {
        const userInsert = await User.create({
            email: email,
            nickName: nickName,
            imageUrl: imageUrl,
        });

        return userInsert;
    } catch (error) {}
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

const getPlanBySuccess = async (userId: number) => {
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
                "publisher",
                "totalPage",
            ],
            required: false,
        },
        where: {
            userId,
            status: "success",
        },
        raw: true,
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

export default {
    getUserByEmail,
    signUp,
    findUserById,
    getPlanBySuccess,
    findAllPlanByUserId,
    deletePlan,
    findOnePlanById,
    restorePlan,
    findPlanByDelete,
};
