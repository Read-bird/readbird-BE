import { Character } from "../../models/domain/Character";

console.log("======Create User Table======");

const create_table_user = async () => {
    await Character.sync({ force: true })
        .then(() => {
            console.log("✅Success Create User Table");
        })
        .catch((err) => {
            console.log("❗️Error in Create User Table : ", err);
        });
};

create_table_user();
