"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "Plans",
            [
                {
                    totalPage: 100,
                    currentPage: 30,
                    status: "inProgress",
                    startDate: "2023-12-12T00:00:00.000Z",
                    endDate: "2023-12-30T00:00:00.000Z",
                    userId: 1,
                    bookId: 1,
                },
            ],
            {},
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Plans", null, {});
    },
};
