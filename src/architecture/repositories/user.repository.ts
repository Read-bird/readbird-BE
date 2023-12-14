import { User } from "../../db/models/domain/User";

const getUserByEmail = async (email: any) => {
    try {
        const userSelect = await User.findOne({
            attributes: ["userId", "email", "nickName", "imageUrl"],
            where: {
                email: email,
            },
        });

        return userSelect;
    } catch (error) {
        return false;
    }
};

const signUp = async (email: any, nickName: any, imageUrl: any) => {
    try {
        const userInsert = await User.create({
            email: email,
            nickName: nickName,
            imageUrl: imageUrl,
        });

        return userInsert;
    } catch (error) {
        return false;
    }
};

export default {
    getUserByEmail,
    signUp,
};
