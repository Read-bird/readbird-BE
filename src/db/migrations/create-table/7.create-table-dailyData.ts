import { DailyData } from "../../models/domain/Tables";

console.log("======Create DailyData Table======");

const create_table_Record = async () => {
    await DailyData.sync({ force: true })
        .then(() => {
            console.log("✅Success Create Record Table");
        })
        .catch((err) => {
            console.log("❗️Error in Create Record Table : ", err);
        });
};

create_table_Record();
