const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const User = require('./../modules/model').User;
const jwt = require('jsonwebtoken');
const jwt_secret = require('./../config').jwt_secret


getCurrentUser = async function (token) {
    try {
        if (!token) {
            return null;
        }
        let user = await jwt.verify(token, jwt_secret);
        return await User.findOne({where: {id: user.id}});

    } catch (e) {
        return null
    }
}


module.exports = {
    getCurrentUser
}
