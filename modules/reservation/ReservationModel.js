'use strict';
const Sequelize = require('sequelize');

const Pending = 0;
const Reserved = 1;

class ReservationModel extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(this.getAttributes(sequelize, DataTypes), this.getOptions(sequelize));
    }

    static associate(models) {
        this.belongsTo(models.Payment, {as: 'payment', foreignKey: 'id'})
        this.hasOne(models.Ticket, {as: 'ticket', foreignKey: 'id'})
        this.hasOne(models.User, {as: 'user', foreignKey: 'id'})
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
            user_id: {
                type: DataTypes.INTEGER
            },
            reservation_status: {
                type: DataTypes.INTEGER
            },
            created_at: {
                type: DataTypes.DATE
            }
        }
    }

    getJson() {
        return {
            id: this.dataValues.id,
            ticket_id: this.dataValues.ticket_id,
            user_id: this.dataValues.user_id,
            reservation_status: this.dataValues.reservation_status,
            created_at: this.dataValues.created_at,
        }
    }

    static getOptions(sequelize) {
        return {
            tableName: 'reservation',
            sequelize,
            timestamps: false
        }
    }


    static getPendingStatus() {
        return Pending;
    }

    static getReservedStatus() {
        return Reserved;
    }

}

module.exports = ReservationModel;
