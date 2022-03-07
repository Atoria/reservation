const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const User = require('./../modules/model').User;


let firstname = process.argv[2],
  lastname = process.argv[3],
  email = process.argv[4],
  password = process.argv[5];


console.log('Firstname: ',firstname);
console.log('Lastname: ',lastname);
console.log('Email: ',email);
console.log('Password: ',password);


run();

function run() {

  try {
    const newUser = {
      first_name: firstname,
      last_name: lastname,
      email: email,
      password_hash: password,
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password_hash, salt, (err, hash) => {
        newUser.password_hash = hash;
        User.create(newUser).then(async (user) => {
          process.exit()
          console.log('REGISTERED SUCCESSFULLY', user.dataValues);
        }).catch((err) => {
          process.exit()
          console.log('ERROR', err);
        })
      })
    })
  } catch (e) {
    console.log('Error', e);
    process.exit()
  }

}
