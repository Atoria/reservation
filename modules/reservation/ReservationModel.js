'use strict';
const Sequelize = require('sequelize');
const moment = require("moment");
const {Reservation} = require("./../model");
const {sequelize} = require("./../../modules/model");

const Pending = 0;
const Reserved = 1;

class ReservationModel extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(this.getAttributes(sequelize, DataTypes), this.getOptions(sequelize));
    }

    static associate(models) {
        this.belongsTo(models.Payment, {as: 'payment', foreignKey: 'id'})
        this.hasOne(models.User, {as: 'user', foreignKey: 'id'})
        this.hasMany(models.ReservedTicket, {as: 'reserved_tickets', foreignKey: 'reservation_id'})
    }


    static getAttributes(sequelize, DataTypes) {
        return {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            user_id: this.dataValues.user_id,
            reservation_status: this.dataValues.reservation_status,
            created_at: this.dataValues.created_at,
            reserved_tickets: this.dataValues.reserved_tickets ?? []
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


    static async getReservedTickets(ticket_ids) {
        return await this.findAll({
            include: [{
                model: this.sequelize.models.ReservedTicketModel,
                as: 'reserved_tickets',
                required: true,
                where: {
                    ticket_id: {[Sequelize.Op.in]: ticket_ids},
                }
            }],

            where: {
                [Sequelize.Op.or]: [
                    {
                        reservation_status:
                            {
                                [Sequelize.Op.eq]: this.getReservedStatus()
                            }
                    },
                    {
                        reservation_status:
                            {
                                [Sequelize.Op.eq]: this.getPendingStatus()
                            },
                        created_at:
                            {
                                [Sequelize.Op.gte]: moment().subtract(15, 'minutes').toDate()
                            },
                    }
                ]
            }
        })
    }


    static async getReservationByID(reservation_id) {
        return await this.findOne({
            include: [{
                model: this.sequelize.models.ReservedTicketModel,
                as: 'reserved_tickets',
                include: [{
                    model: this.sequelize.models.TicketModel,
                    as: 'ticket',
                }]
            }],
            where: {
                id: reservation_id,
                reservation_status:
                    {
                        [Sequelize.Op.eq]: ReservationModel.getPendingStatus()
                    },
                created_at:
                    {
                        [Sequelize.Op.gte]: moment().subtract(15, 'minutes').toDate()
                    },
            }
        });
    }

}

module.exports = ReservationModel;
