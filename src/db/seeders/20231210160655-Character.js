"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "Characters",
            [
                {
                    name: "짹짹이 1",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
                {
                    name: "짹짹이 2",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
                {
                    name: "짹짹이 3",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
                {
                    name: "짹짹이 4",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
                {
                    name: "짹짹이 5",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
                {
                    name: "짹짹이 6",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
                {
                    name: "짹짹이 7",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
                {
                    name: "짹짹이 8",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
                {
                    name: "짹짹이 9",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
                {
                    name: "짹짹이 10",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
                {
                    name: "짹짹이 11",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
                {
                    name: "짹짹이 12",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
                {
                    name: "짹짹이 13",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
                {
                    name: "짹짹이 14",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
                {
                    name: "짹짹이 15",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
                {
                    name: "짹짹이 16",
                    content:
                        "짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이짹짹이 짹짹이",
                    imageUrl:
                        "https://readbird.s3.ap-northeast-2.amazonaws.com/도감+캐릭터.png",
                },
            ],
            {},
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Characters", null, {});
    },
};
