'use strict';
const Sequelize = require('sequelize');

class ReservedTicketModel extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(this.getAttributes(sequelize, DataTypes), this.getOptions(sequelize));
    }

    static associate(models) {
        this.belongsTo(models.Reservation, {as: 'reservation'})
        this.belongsTo(models.Ticket, {as: 'ticket'})
    }


    static getAttributes(sequelize, DataTypes) {
        return {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            ticket_id: {
                type: DataTypes.INTEGER,
            },
            reservation_id: {
                type: DataTypes.INTEGER
            },
        }
    }

    getJson() {
        return {
            id: this.dataValues.id,
            ticket_id: this.dataValues.ticket_id,
            reservation_id: this.dataValues.reservation_id,
            ticket: this.dataValues.ticket ? this.dataValues.ticket : null
        }
    }

    static getOptions(sequelize) {
        return {
            tableName: 'reserved_ticket',
            sequelize,
            timestamps: false
        }
    }

}

module.exports = ReservedTicketModel;
