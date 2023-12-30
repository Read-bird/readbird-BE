import { Collection } from "../../models/domain/Tables";

console.log("======Create Collection Table======");

const create_table_Collection = async () => {
    await Collection.sync({ force: true })
        .then(() => {
            console.log("✅Success Create Collection Table");
        })
        .catch((err) => {
            console.log("❗️Error in Create Collection Table : ", err);
        });
};

create_table_Collection();
