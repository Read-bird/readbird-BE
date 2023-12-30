import { Character } from "../../models/domain/Tables";

console.log("======Create Character Table======");

const create_table_character = async () => {
    await Character.sync({ force: true })
        .then(() => {
            console.log("✅Success Create Character Table");
        })
        .catch((err) => {
            console.log("❗️Error in Create Character Table : ", err);
        });
};

create_table_character();
