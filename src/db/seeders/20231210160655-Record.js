"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            "Records",
            [
                {
                    status: "success",
                    planId: 1,
                    userId: 1,
                    successAt: "2023-12-11",
                },
                {
                    status: "success",
                    planId: 1,
                    userId: 1,
                    successAt: "2023-12-13",
                },
                {
                    status: "success",
                    planId: 1,
                    userId: 1,
                    successAt: "2023-12-14",
                },
                {
                    status: "success",
                    planId: 1,
                    userId: 1,
                    successAt: "2023-12-16",
                },
                {
                    status: "success",
                    planId: 1,
                    userId: 1,
                    successAt: "2023-12-17",
                },
            ],
            {},
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("Records", null, {});
    },
};
