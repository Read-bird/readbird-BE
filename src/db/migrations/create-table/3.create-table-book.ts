import { Book } from "../../models/domain/Tables";

console.log("======Create Book Table======");

const create_table_Book = async () => {
    await Book.sync({ force: true })
        .then(() => {
            console.log("✅Success Create Book Table");
        })
        .catch((err) => {
            console.log("❗️Error in Create Book Table : ", err);
        });
};

create_table_Book();
