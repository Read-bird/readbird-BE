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

const deleteAllPlan = async (userId: number) => {
    const findAllPlanByUserId =
        await userRepository.findAllPlanByUserId(userId);

    console.log(findAllPlanByUserId[0]);

    for (let i = 0; i < findAllPlanByUserId.length; i++) {
        await userRepository.deletePlan(
            userId,
            Number(findAllPlanByUserId[i].planId),
        );
    }
};

export default {
    signInKakao,
    findGuestData,
    deleteAllPlan,
};
