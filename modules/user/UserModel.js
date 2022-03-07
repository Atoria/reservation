'use strict';
const Sequelize = require('sequelize');

class UserModel extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(this.getAttributes(sequelize, DataTypes), this.getOptions(sequelize));
    }

    static associate(models) {
        this.hasMany(models.Reservation, {foreignKey: 'user_id'})
    }


    static getAttributes(sequelize, DataTypes) {
        return {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: DataTypes.STRING,
                unique: true
            },
            first_name: {
                type: DataTypes.STRING
            },
            password_hash: {
                type: DataTypes.STRING
            },
            last_name: {
                type: DataTypes.STRING
            }
        }
    }

    getJson() {
        return {
            first_name: this.dataValues.first_name,
            last_name: this.dataValues.last_name,
            email: this.dataValues.email,
            id: this.dataValues.id,
        }
    }

    static getOptions(sequelize) {
        return {
            tableName: 'user',
            sequelize,
            timestamps: false
        }
    }
}

module.exports = UserModel;
