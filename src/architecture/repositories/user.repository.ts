import { User } from "../../db/models/domain/Tables";

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

export default {
    getUserByEmail,
    signUp,
    findUserById,
};
