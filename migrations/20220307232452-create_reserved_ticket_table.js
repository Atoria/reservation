'use strict';

const ReservationModel = require("../modules/reservation/ReservationModel");
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable('reserved_ticket', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ticket_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'ticket',
          key: 'id',
        },
      },
      reservation_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'reservation',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('reserved_ticket');

  }
};
