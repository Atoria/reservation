const usersRouter = require('../modules/user/userRouter');
const reservationRouter = require('../modules/reservation/reservationRouter');

module.exports = function (app) {
  app.use('/user', usersRouter);
  app.use('/reservation', reservationRouter);
}
