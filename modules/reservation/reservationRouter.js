const express = require('express');
const router = express.Router();
const auth = require('../../helpers/auth');
const {body, validationResult} = require('express-validator');
const Responder = require("../../helpers/responder");
const Reservation = require('./../model').Reservation;
const Sequelize = require('sequelize');
const TicketModel = require("../ticket/TicketModel");

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

            const reservedTickets = await Reservation.findAll({
                where: {
                    ticket_id: {[Sequelize.Op.in]: ticket_ids}
                }
            })

            if (reservedTickets.length > 0) {
                let reservedTicketIDs = reservedTickets.map((elem) => elem.ticket_id);
                return res.send(Responder.answer(200, `Tickets ${reservedTicketIDs.join(', ')} are already reserved`))
            }

            try{
                const areValidTickets = await TicketModel.validateBuyingTickets(ticket_ids);

                if(!areValidTickets.success){
                    return res.send(Responder.answer(200, areValidTickets.error))
                }

            }catch (e){
                return res.send(Responder.answer(500))
            }


            return res.send(Responder.answer(200))
        })
    });

})


module.exports = router;
