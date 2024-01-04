import { Op } from "sequelize";
import { Plan, Record, User } from "../../db/models/domain/Tables";
import getDateFormat from "../setDateFormat";

const newDate = new Date();
export const today = getDateFormat(
    new Date(newDate.setDate(newDate.getDate() - 1)),
);

//일간 신규 유입
export const getTodayNewUser = async () => {
    return User.count({
        where: {
            createdAt: { [Op.like]: today },
        },
    });
};

//완독 성공 체크된 플랜 개수 / 전체 유저의 등록 플랜 개수
export const getPlanSuccessPerPlanCreate = async () => {
    const totalPlan = await Plan.count();

    const successPlan = await Plan.count({
        where: {
            status: "success",
        },
    });

    return Math.round((successPlan / totalPlan) * 100).toFixed(2);
};

//(달성 체크한 플랜 개수 / 전체 유저의 진행중 플랜 개수)
export const getRecordPerInProgressPlan = async () => {
    const inProgressPlan = await Plan.count({
        where: {
            status: "inProgress",
        },
    });

    const todayCreateRecord = await Record.count({
        where: {
            createdAt: { [Op.like]: today },
        },
    });

    return Math.round((todayCreateRecord / inProgressPlan) * 100).toFixed(2);
};

//완독 실패 체크된 플랜 개수 / 전체 유저의 등록 플랜 개수
export const getFailedPlanPerPlan = async () => {
    const totalPlan = await Plan.count();

    const failedPlan = await Plan.count({
        where: {
            status: "failed",
        },
    });

    return Math.round((failedPlan / totalPlan) * 100).toFixed(2);
};
