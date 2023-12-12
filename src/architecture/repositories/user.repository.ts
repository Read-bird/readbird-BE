import { User } from "../../db/models/domain/User";

const getUserByEmail = async (email: any) => {
    try {
        //let sql = `SELECT DISTINCT userId, email, nickName, imageUrl FROM Users WHERE email = '${email}'`;
        // const userSelect = await Users.sequelize!.query(sql);
        const userSelect = await User.findOne({
            attributes: ["email", "nickName", "imageUrl"],
            where: {
                email: email,
            },
        });
        console.log("\nuserSelect ::: " + JSON.stringify(userSelect));
        return userSelect;
    } catch (error) {
        console.log("\nCRUD Error::: " + error);
        return false;
    }
};

const signUp = async (email: any, nickName: any, imageUrl: any) => {
    try {
        // let sql = `INSERT INTO Users (email, nickName, imageUrl) VALUES ('${email}','${nickName}','${imageUrl}')`;
        //const userInsert = await Users.sequelize!.query(sql);
        const userInsert = await User.create({
            email: email,
            nickName: nickName,
            imageUrl: imageUrl,
        });
        console.log("\nuserInsert ::: " + JSON.stringify(userInsert));
        return userInsert;
    } catch (error) {
        console.log("\nCRUD Error::: " + error);
        return false;
    }
};

export default {
    getUserByEmail,
    signUp,
};
