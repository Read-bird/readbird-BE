import { Record } from "../../models/domain/Record";

console.log("======Create Record Table======");

const create_table_Record = async () => {
    await Record.sync({ force: true })
        .then(() => {
            console.log("✅Success Create Record Table");
        })
        .catch((err) => {
            console.log("❗️Error in Create Record Table : ", err);
        });
};

create_table_Record();
