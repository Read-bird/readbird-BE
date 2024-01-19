import { Op } from "sequelize";
import { DailyData, Plan, Record, User } from "../../db/models/domain/Tables";
import getDateFormat from "../setDateFormat";

const baseDate = getDateFormat(new Date("2024-01-13"));

//일간 신규 유입
export const getTodayNewUser = async (today) => {
    return User.count({
        where: {
            createdAt: {
                [Op.gte]: today,
                [Op.lt]: getDateFormat(new Date()),
            },
        },
    });
};

//완독 성공 체크된 플랜 개수 / 전체 유저의 등록 플랜 개수
export const getPlanSuccessPerPlanCreate = async () => {
    const totalPlan = await Plan.count({
        where: {
            status: ["success", "inProgress", "failed", "restore"],
            createdAt: {
                [Op.gte]: baseDate,
            },
        },
    });

    const successPlan = await Plan.count({
        where: {
            status: "success",
            createdAt: {
                [Op.gte]: baseDate,
            },
        },
    });

    return Math.round((successPlan / totalPlan) * 100).toFixed(2);
};

//(달성 체크한 플랜 개수 / 전체 유저의 진행중 플랜 개수)
export const getRecordPerInProgressPlan = async (today) => {
    const inProgressPlan = await Plan.count({
        where: {
            status: "inProgress",
            createdAt: {
                [Op.gte]: baseDate,
            },
        },
    });

    const todayCreateRecord = await Record.count({
        where: {
            createdAt: { [Op.gte]: today, [Op.lt]: getDateFormat(new Date()) },
        },
    });

    return Math.round((todayCreateRecord / inProgressPlan) * 100).toFixed(2);
};

//완독 실패 체크된 플랜 개수 / 전체 유저의 등록 플랜 개수
export const getFailedPlanPerPlan = async () => {
    const totalPlan = await Plan.count({
        where: {
            createdAt: {
                [Op.gte]: baseDate,
            },
        },
    });

    const failedPlan = await Plan.count({
        where: {
            status: "failed",
            createdAt: {
                [Op.gte]: baseDate,
            },
        },
    });

    return Math.round((failedPlan / totalPlan) * 100).toFixed(2);
};

export const getTodayDAU = async (today) => {
    const dailyData = await DailyData.findOne({
        where: {
            today,
        },
    });

    if (!dailyData) {
        return 0;
    } else {
        const userList = JSON.parse(dailyData.dailyLoginUserList);
        return userList.list.length;
    }
};

export const getTodayTouchPerCreatePlan = async (today) => {
    const dailyData = await DailyData.findOne({
        where: {
            today,
        },
    });

    const dailyCreatedPlan = await Plan.count({
        where: {
            createdAt: {
                [Op.gte]: today,
                [Op.lt]: getDateFormat(new Date()),
            },
            status: ["success", "inProgress", "failed", "restore"],
        },
    });

    if (!dailyData) {
        return 0;
    } else {
        return Math.round(
            (dailyCreatedPlan / dailyData.touchedPlanButton) * 100,
        ).toFixed(2);
    }
};

export const getPlanByTodayNewUser = async (today) => {
    return User.count({
        include: {
            model: Plan,
            required: true,
            as: "plans",
        },
        where: {
            createdAt: {
                [Op.gte]: today,
                [Op.lt]: getDateFormat(new Date()),
            },
        },
        raw: true,
    });
};
