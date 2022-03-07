'use strict';
const Sequelize = require('sequelize');
const EvenType = 1;
const AllTogetherType = 2;
const AvoidOneType = 3;


class TicketModel extends Sequelize.Model {
    static init(sequelize, DataTypes) {
        return super.init(this.getAttributes(sequelize, DataTypes), this.getOptions(sequelize));
    }

    static associate(models) {
        this.belongsTo(models.Event, {as: 'event'})
        this.hasMany(models.Reservation, {as: 'reserved', foreignKey: 'ticket_id'})
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
        }
    }

    static getOptions(sequelize) {
        return {
            tableName: 'ticket',
            sequelize,
            timestamps: false
        }
    }

    static getEvenType() {
        return EvenType;
    }

    static getAllTogetherType() {
        return AllTogetherType;
    }

    static getAvoidOneType() {
        return AvoidOneType;
    }


    static async validateBuyingTickets(ticketIDs) {
        return new Promise(async (resolve, reject) => {
            try {

                const tickets = await this.findAll(
                    {
                        include: ['event'],
                        where: {
                            id: {[Sequelize.Op.in]: ticketIDs}
                        }
                    });

                if (tickets.length !== ticketIDs.length) {
                    return resolve({success: false, error: 'Tickets not found'});
                }

                if (!tickets) {
                    return resolve({success: false, error: 'Ticket not found'});
                }

                //get each type of ticket list
                const evenTickets = [];
                let allTogetherTickets = [];
                const avoidOneTickets = [];
                let eventID = null;
                let isSameEventTickets = true;

                tickets.forEach((ticket) => {
                    ticket = ticket.getJson();
                    if (eventID === null) {
                        eventID = ticket.event_id;
                    } else if (eventID !== ticket.event_id) {
                        isSameEventTickets = false;
                    }

                    if (ticket.type === this.getEvenType()) {
                        evenTickets.push(ticket)
                    } else if (ticket.type === this.getAllTogetherType()) {
                        allTogetherTickets.push(ticket)
                    } else if (ticket.type === this.getAvoidOneType()) {
                        avoidOneTickets.push(ticket)
                    }
                })

                if (!isSameEventTickets) {
                    return resolve({success: false, error: 'Tickets does not belong to same event'});
                }

                //check even type tickets
                if (evenTickets.length % 2 !== 0) {
                    return resolve({success: false, error: 'Ticket pattern is not matched for even type tickets'});
                }

                //check together tickets
                allTogetherTickets = allTogetherTickets.sort((a, b) => a.column - b.column);
                let col = null;
                let row = null;
                let isValid = true;
                allTogetherTickets.forEach((ticket) => {
                    if (col === null) {
                        col = ticket.column
                    } else {
                        if (ticket.column - col !== 1) {
                            isValid = false;
                        }
                        col = ticket.column;
                    }

                    if(row === null){
                        row = ticket.row
                    }else if(row !== ticket.row){
                        isValid = false;
                    }
                })

                if (!isValid) {
                    return resolve({
                        success: false,
                        error: 'Ticket pattern is not matched for all together type tickets'
                    });
                }


                if (avoidOneTickets.length > 0) {
                    //get all available tickets which are not already reserved and not chosen to be booked
                    const allAvoidOneTickets = await this.count({
                        include: [
                            {
                                model: this.sequelize.models.ReservationModel,
                                as: 'reserved',
                                required: false,
                            }
                        ],
                        where: {
                            type: this.getAvoidOneType(),
                            '$reserved.ticket_id$': null,
                            id: {[Sequelize.Op.notIn]: avoidOneTickets.map(ticket => ticket.id)}
                        },
                    })

                    if (allAvoidOneTickets === 1) {
                        return resolve({
                            success: false,
                            error: 'Ticket pattern is not matched for avoid one type tickets'
                        });
                    }

                }

                return resolve({success: true, event_id: eventID})
            } catch (e) {
                console.log(e);
                return reject({success: false})
            }

        })

    }
}

module.exports = TicketModel;
