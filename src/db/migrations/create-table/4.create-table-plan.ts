import { Plan } from "../../models/domain/Tables";

console.log("======Create Plan Table======");

const create_table_plan = async () => {
    await Plan.sync({ force: true })
        .then(() => {
            console.log("✅Success Create Plan Table");
        })
        .catch((err) => {
            console.log("❗️Error in Create Plan Table : ", err);
        });
};

create_table_plan();
