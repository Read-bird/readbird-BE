import axios from "axios";
import UserRepository from "../repositories/user.repository";
import userRepository from "../repositories/user.repository";

const signInKakao = async (kakaoToken: String) => {
    try {
        const result = await axios.get("https://kapi.kakao.com/v2/user/me", {
            headers: {
                Authorization: `Bearer ${kakaoToken}`,
            },
        });

        const { data } = result;

        const email: String = data.kakao_account.email;
        const nickName: String = data.properties.nickname;
        const imageUrl: String = data.properties.profile_image;

        if (!email || !nickName) throw new Error("KEY_ERROR");

        //DB 유저 정보 찾기
        const userData = await UserRepository.getUserByEmail(email);

        //DB에 유저 정보가 없을 경우 유저 정보 등록
        if (!userData) {
            await UserRepository.signUp(email, nickName, imageUrl);
            const userData = await UserRepository.getUserByEmail(email);
            return userData;
        }

        return userData;
    } catch (error) {
        console.log("\nerror ::: " + error);
    }
};

const findGuestData = async () => {
    return UserRepository.findUserById(1);
};

const getPlanBySuccess = async (userId: number) => {
    return userRepository.getPlanBySuccess(userId);
};

const deleteAllPlan = async (userId: number) => {
    const findAllPlanByUserId =
        await userRepository.findAllPlanByUserId(userId);

    for (let i = 0; i < findAllPlanByUserId.length; i++) {
        await userRepository.deletePlan(
            userId,
            Number(findAllPlanByUserId[i].planId),
        );
    }
};

const restorePlan = async (userId: number, planId: number) => {
    const findOnePlanById = await userRepository.findOnePlanById(
        userId,
        planId,
    );

    if (findOnePlanById === null)
        throw new Error("Not Found : 플랜을 찾을 수 없습니다.");
    if (findOnePlanById.status !== "delete")
        throw new Error("Bad Request : 삭제 되지 않은 플랜입니다.");

    let status = "success";

    if ((findOnePlanById.currentPage || 0) < findOnePlanById.totalPage) {
        if (findOnePlanById.endDate < new Date()) {
            status = "failed";
        } else {
            status = "inProgress";
        }
    }

    const restorePlan = await userRepository.restorePlan(
        userId,
        planId,
        status,
    );

    if (!restorePlan)
        throw new Error(
            "Server Error : 복구에 실패하였습니다. 다시 시도해주세요.",
        );
};

const findPlanByDelete = async (userId: number) => {
    return userRepository.findPlanByDelete(userId);
};

export default {
    signInKakao,
    findGuestData,
    getPlanBySuccess,
    deleteAllPlan,
    restorePlan,
    findPlanByDelete,
};
