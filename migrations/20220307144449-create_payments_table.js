'use strict';

const PaymentModel = require("../modules/payment/PaymentModel");
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        return queryInterface.createTable('payment', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'user',
                    key: 'id',
                },
            },
            reservation_id: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'reservation',
                    key: 'id',
                },
            },
            payment_status: {
                type: Sequelize.INTEGER,
                defaultValue: PaymentModel.getPendingStatus()
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('now')
            },
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        return queryInterface.dropTable('payment');
    }
};
