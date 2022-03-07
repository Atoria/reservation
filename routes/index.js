const usersRouter = require('../modules/user/userRouter');
const reservationRouter = require('../modules/reservation/ReservationRouter');
const paymentRouter = require('../modules/payment/PaymentRouter');

module.exports = function (app) {
  app.use('/user', usersRouter);
  app.use('/reservation', reservationRouter);
  app.use('/payment', paymentRouter);
}
