'use strict';
const Sequelize = require('sequelize');

const Pending = 0;
const Failed = 1;
const Success = 2;

class PaymentModel extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(this.getAttributes(sequelize, DataTypes), this.getOptions(sequelize));
    }

    static associate(models) {
        this.hasOne(models.Reservation, {as: 'reservation', foreignKey: 'id'})
    }


    static getAttributes(sequelize, DataTypes) {
        return {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            reservation_id: {
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
            reservation_id: this.dataValues.reservation_id,
            created_at: this.dataValues.created_at,
        }
    }

    static getOptions(sequelize) {
        return {
            tableName: 'payment',
            sequelize,
            timestamps: false
        }
    }

    static getPendingStatus() {
        return Pending
    }

    static getFailedStatus() {
        return Failed
    }

    static getSuccessStatus() {
        return Success;
    }
}

module.exports = PaymentModel;
