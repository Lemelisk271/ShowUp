'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models')
const bcrypt = require('bcryptjs')

let options = {}
if (process.env.NOD_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'John',
        lastName: 'Smith'
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Jane',
        lastName: 'Doe'
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Tim',
        lastName: 'Jones'
      }
    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users'
    const Op = Sequelize.Op
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'user1@user.io', 'user2@user.io'] }
    })
  }
};
