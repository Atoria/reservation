'use strict';
const Sequelize = require('sequelize');

class PaymentModel extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(this.getAttributes(sequelize, DataTypes), this.getOptions(sequelize));
    }

    static associate(models) {
        this.belongsTo(models.User,{ as: 'user', foreignKey: 'id' })
        this.hasMany(models.Reservation, {foreignKey: 'payment_id'})
    }


    static getAttributes(sequelize, DataTypes) {
        return {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
            },
            reservation_id: {
                type: DataTypes.INTEGER
            },
            payment_status: {
                type: DataTypes.INTEGER
            },
            created_at: {
                type: DataTypes.DATE
            }
        }
    }

    getJson() {
        return {
            description: this.dataValues.description,
            end_date: this.dataValues.end_date,
            start_date: this.dataValues.start_date,
            name: this.dataValues.name,
            id: this.dataValues.id,
        }
    }

    static getOptions(sequelize) {
        return {
            tableName: 'payment',
            sequelize,
            timestamps: false
        }
    }
}

module.exports = PaymentModel;
