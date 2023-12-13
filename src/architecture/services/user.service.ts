import axios from "axios";
import UserRepository from "../repositories/user.repository";
import { error } from "console";

const signInKakao = async (kakaoToken: String) => {
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
};

export default {
    signInKakao,
};
