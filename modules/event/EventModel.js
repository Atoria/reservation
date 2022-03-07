'use strict';
const Sequelize = require('sequelize');

class EventModel extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(this.getAttributes(sequelize, DataTypes), this.getOptions(sequelize));
    }

    static associate(models) {
        this.hasMany(models.Ticket, {foreignKey: 'event_id'})
    }


    static getAttributes(sequelize, DataTypes) {
        return {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
            },
            start_date: {
                type: DataTypes.DATE
            },
            end_date: {
                type: DataTypes.DATE
            },
            description: {
                type: DataTypes.STRING
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
            tableName: 'event',
            sequelize,
            timestamps: false
        }
    }
}

module.exports = EventModel;
