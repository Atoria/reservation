const usersRouter = require('../modules/user/userRouter');
const reservationRouter = require('../modules/reservation/reservationRouter');
const paymentRouter = require('../modules/payment/paymentRouter');

module.exports = function (app) {
  app.use('/user', usersRouter);
  app.use('/reservation', reservationRouter);
  app.use('/payment', paymentRouter);
}
