const usersRouter = require('../modules/user/userRouter');

module.exports = function (app) {
  app.use('/user', usersRouter);
}
