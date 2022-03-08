const express = require('express');
const router = express.Router();
const auth = require('../../helpers/auth');
const {body, validationResult} = require('express-validator');
const Responder = require("../../helpers/responder");
const Sequelize = require('sequelize');
const TicketModel = require("../ticket/TicketModel");
const moment = require("moment");
const ReservationModel = require("../reservation/ReservationModel");
const {seq} = require("async/index");
const sequelize = require('./../../modules/model').sequelize;
const Reservation = require('./../model').Reservation;
const Payment = require('./../model').Payment;
const User = require('./../model').User;

router.all('/*', auth.isAuthorized, (req, res, next) => {
    next();
})

router.post('/', async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
        req.checkBody('reservation_id', 'Ticket ID is required').notEmpty();

        req.getValidationResult().then(async (result) => {
            if (!result.isEmpty()) {
                return res.send(Responder.answer(
                    400,
                    result.array()
                ))
            }
            const reservation_id = req.body.reservation_id;
            let reservation = null;
            let totalAmount = 0;
            try {

                reservation = await ReservationModel.getReservationByID(reservation_id);

                if (!reservation) {
                    return res.send(Responder.answer(200, [], 'Time has been expired'))
                }

                reservation.reserved_tickets.forEach((item) => {
                    item = item.getJson();
                    totalAmount += parseFloat(item.ticket.price);
                })

                if (req.user.dataValues.balance < totalAmount) {
                    return res.send(Responder.answer(200, [], 'User does not have enough balance'))
                }
            } catch (e) {
                console.log(e);
                return res.send(Responder.answer(500, [], 'Internal server error'))
            }


            //mock payment Service If there was a real service at first request would be made and then saved in db with transaction on separate table

            const transaction = await sequelize.transaction();
            try {
                await User.update({
                    balance: parseFloat(parseFloat(req.user.dataValues.balance) - totalAmount)
                }, {
                    where: {
                        id: req.user.dataValues.id
                    },
                    transaction: transaction
                })
                await Payment.create({
                    reservation_id: reservation_id
                }, {transaction: transaction});

                await Reservation.update({
                        reservation_status: ReservationModel.getReservedStatus(),
                    },
                    {
                        where: {
                            id: reservation_id
                        },
                        transaction: transaction
                    })

                await transaction.commit();
            } catch (e) {
                await transaction.rollback();
                return res.send(Responder.answer(500, [], e.message))
            }

            return res.send(Responder.answer(200))
        })
    });

})


module.exports = router;
