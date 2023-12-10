"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "Books",
            [
                {
                    title: "제3인류 1",
                    author: "베르나르 베르베르 지음, 이세욱 옮김",
                    pubDate: "2013-10-21",
                    description:
                        "베르나르 베르베르 특유의 상상력으로 축조한 장대한 스케일의 과학 소설. 남극. 저명한 고생물학자 샤를 웰즈의 탐사대가 17미터에 달하는 거인의 유골들을 발굴한다. 그러나 인류사를 다시 쓰게 만들 이 중대한 발견은 발굴 현장의 사고와 함께 곧바로 파묻히고 마는데…",
                    isbn: "8932916373",
                    coverImage:
                        "http://image.aladin.co.kr/product/3213/68/coversum/8932916373_2.jpg",
                    publisher: "열린책들",
                    totalPage: 900,
                },
                {
                    title: "제3인류 2",
                    author: "베르나르 베르베르 지음, 이세욱 옮김",
                    pubDate: "2013-10-21",
                    description:
                        "베르나르 베르베르 특유의 상상력으로 축조한 장대한 스케일의 과학 소설. 남극. 저명한 고생물학자 샤를 웰즈의 탐사대가 17미터에 달하는 거인의 유골들을 발굴한다. 그러나 인류사를 다시 쓰게 만들 이 중대한 발견은 발굴 현장의 사고와 함께 곧바로 파묻히고 마는데…",
                    isbn: "8932916381",
                    coverImage:
                        "http://image.aladin.co.kr/product/3213/69/coversum/8932916381_2.jpg",
                    publisher: "열린책들",
                    totalPage: 800,
                },
                {
                    title: "딸아, 외로울 때는 시를 읽으렴 - 지금 생의 가장 아름다운 시절을 보내고 있는 당신에게 주고 싶은 시 90편",
                    author: "신현림 엮음",
                    pubDate: "2010-04-04",
                    description:
                        "사진작가이자 시인 신현림이 인생의 가장 아름다운 시절을 보내고 있는 세상의 모든 딸들에게 들려주고 싶은 시 90편을 모았다. 그녀는 자신이 얼마나 예쁜지도 모른 채 방황하고 있는 딸들을 생각하며 시를 골랐다고 한다. 이 책은 시를 통해 넘어져 아파도 씩씩하게 털고 일어나는 힘을 얻게 되길, 그래서 세상에서 가장 행복한 사람이 되길 바라는 마음을 담은 따뜻한 응원가이다.",
                    isbn: "8901121182",
                    coverImage:
                        "http://image.aladin.co.kr/product/1132/19/coversum/8901121182_1.jpg",
                    publisher: "걷는나무",
                    totalPage: 400,
                },
            ],
            {},
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Books", null, {});
    },
};
