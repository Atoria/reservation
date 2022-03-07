'use strict';

const TicketModel = require("../modules/ticket/TicketModel");
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable('ticket', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            event_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'event',
                    key: 'id',
                },
            },
            row: {
                type: Sequelize.INTEGER
            },
            column: {
                type: Sequelize.INTEGER
            },
            price: {
                type: Sequelize.DOUBLE,
            },
            type: {
                type: Sequelize.INTEGER
            },
            status: {
                type: Sequelize.INTEGER,
                defaultValue: TicketModel.getOpenStatus()
            }
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        return queryInterface.dropTable('ticket');

    }
};
