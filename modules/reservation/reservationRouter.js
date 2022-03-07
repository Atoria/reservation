const express = require('express');
const router = express.Router();
const auth = require('../../helpers/auth');

router.all('/*', auth.isAuthorized, (req, res, next) => {
  next();
})

router.post('/', async (req, res, next) => {

})


module.exports = router;
