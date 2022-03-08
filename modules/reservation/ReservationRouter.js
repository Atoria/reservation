const express = require('express');
const router = express.Router();
const auth = require('../../helpers/auth');
const {body, validationResult} = require('express-validator');
const Responder = require("../../helpers/responder");
const Reservation = require('./../model').Reservation;
const ReservedTicket = require('./../model').ReservedTicket;
const Sequelize = require('sequelize');
const TicketModel = require("../ticket/TicketModel");
const ReservationModel = require("./ReservationModel");
const moment = require("moment");
const ReservedTicketModel = require("../reserved-ticket/ReservedTicketModel");
const {User} = require("./../model");
const sequelize = require('./../../modules/model').sequelize;

router.all('/*', auth.isAuthorized, (req, res, next) => {
    next();
})

router.post('/', async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
        req.checkBody('ticket_ids', 'Ticket ID is required').notEmpty();

        req.getValidationResult().then(async (result) => {
            if (!result.isEmpty()) {
                return res.send(Responder.answer(
                    400,
                    result.array()
                ))
            }

            const ticket_ids = Array.isArray(req.body.ticket_ids) ? req.body.ticket_ids : [req.body.ticket_ids];

            try {
                //delete expired reservation in any case not to cause db error on unique key
                await Reservation.destroy({
                    where: {
                        reservation_status:
                            {
                                [Sequelize.Op.eq]: ReservationModel.getPendingStatus()
                            },
                        created_at:
                            {
                                [Sequelize.Op.lte]: moment().subtract(15, 'minutes').toDate()
                            },
                    }
                })


                //check if any of those tickets are already reserved
                const reservedTickets = await ReservationModel.getReservedTickets(ticket_ids);

                if (reservedTickets.length > 0) {
                    let reservedTicketIDs = reservedTickets.map((elem) => elem.ticket_id);
                    return res.send(Responder.answer(400, [], `Tickets ${reservedTicketIDs.join(', ')} are already reserved`))
                }

                //execute validation
                const areValidTickets = await TicketModel.validateBuyingTickets(ticket_ids);

                if (!areValidTickets.success) {
                    return res.send(Responder.answer(400, [], areValidTickets.error))
                }
            } catch (e) {
                return res.send(Responder.answer(500, [], e.message))
            }


            let reservations = [];
            const transaction = await sequelize.transaction()
            try {

                const reservation = await Reservation.create({user_id: req.user.dataValues.id}, {transaction: transaction});

                const batchData = [];
                ticket_ids.forEach((id) => {
                    batchData.push({
                        ticket_id: id,
                        reservation_id: reservation.dataValues.id
                    })
                })
                reservations = await ReservedTicket.bulkCreate(batchData, {transaction: transaction});

                await transaction.commit()
            } catch (e) {
                await transaction.rollback()
                return res.send(Responder.answer(500, [], e.message))

            }
            return res.send(Responder.answer(200, reservations))
        })
    });

})

router.get('/', async (req, res, next) => {
    let reservation = await ReservationModel.getAllReservationData()

    return res.send({success: true, reservation})


})


module.exports = router;
