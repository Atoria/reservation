'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        return queryInterface.addColumn(
            'user',
            'balance',
            {
                type: Sequelize.DOUBLE.UNSIGNED,
                defaultValue: 0
            }
        );

    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        return queryInterface.removeColumn(
            'user',
            'balance'
        );
    }
};
