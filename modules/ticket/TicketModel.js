'use strict';
const Sequelize = require('sequelize');
const Open = 0;
const Sold = 1;


class TicketModel extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(this.getAttributes(sequelize, DataTypes), this.getOptions(sequelize));
    }

    static associate(models) {
        this.belongsTo(models.Event, {as: 'event', foreignKey: 'id'})
        this.hasMany(models.Reservation, {foreignKey: 'ticket_id'})
    }


    static getAttributes(sequelize, DataTypes) {
        return {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            event_id: {
                type: DataTypes.INTEGER,
                unique: true
            },
            row: {
                type: DataTypes.INTEGER
            },
            column: {
                type: DataTypes.INTEGER
            },
            price: {
                type: DataTypes.DOUBLE
            },
            type: {
                type: DataTypes.INTEGER
            },
            status: {
                type: DataTypes.INTEGER
            }
        }
    }

    getJson() {
        return {
            id: this.dataValues.id,
            event_id: this.dataValues.event_id,
            row: this.dataValues.row,
            column: this.dataValues.column,
            price: this.dataValues.price,
            type: this.dataValues.type,
            status: this.dataValues.status,
        }
    }

    static getOptions(sequelize) {
        return {
            tableName: 'ticket',
            sequelize,
            timestamps: false
        }
    }

    static getOpenStatus(){
        return Open;
    }

    static getSoldStatus(){
        return Sold;
    }
}

module.exports = TicketModel;
