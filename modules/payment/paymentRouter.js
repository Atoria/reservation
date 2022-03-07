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

router.all('/*', auth.isAuthorized, (req, res, next) => {
    next();
})

router.post('/', async (req, res, next) => {
    return new Promise(async (resolve, reject) => {
        req.checkBody('reservation_ids', 'Ticket ID is required').notEmpty();

        req.getValidationResult().then(async (result) => {
            if (!result.isEmpty()) {
                return res.send(Responder.answer(
                    400,
                    result.array()
                ))
            }
            const reservation_ids = Array.isArray(req.body.reservation_ids) ? req.body.reservation_ids : [req.body.reservation_ids];

            const reservations = await Reservation.findAll({
                where: {
                    id: reservation_ids,
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

            if (reservations.length !== reservation_ids.length) {
                return res.send(Responder.answer(200, [], 'Time has been expired'))
            }

            const batchInsert = [];

            reservation_ids.forEach((id) => {
                batchInsert.push({
                    user_id: req.user.dataValues.id,
                    reservation_id: id,
                })
            })

            //mock payment Service


            const transaction = await sequelize.transaction();
            try {
                await Payment.bulkCreate(batchInsert, {transaction: transaction});
                await Reservation.update({
                        reservation_status: ReservationModel.getReservedStatus(),
                    },
                    {
                        where: {
                            id: {[Sequelize.Op.in]: reservation_ids}
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
