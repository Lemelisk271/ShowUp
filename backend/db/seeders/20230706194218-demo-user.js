'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models')
const bcrypt = require('bcryptjs')

let options = {}
if (process.env.NOD_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

const names = ['Zach Smith', 'Emma Anema', 'Izolda Spellmeyer', 'Anwar Miyata', 'Davit Lange', 'Sawney Klimek', 'Manda Audley', 'Elisabeth Salinas', 'Haroun Prinz', 'Solveig Thomas', 'Urbain Ivankov', 'Hippolyte Richards', 'Madlenka Hirsch', 'Dagmar Chaudhuri', 'Zaur Leslie', 'Gord Albero', 'Tanner Kaube', 'Trophimos Krall', 'Kasih Dirchs', 'Gamila Harrison']

const userSeeds = []

names.forEach(name => {
  name = name.split(" ")
  const [firstName, lastName] = name
  const obj = {
    firstName: firstName,
    lastName: lastName,
    email: `${firstName[0].toLowerCase()}${lastName.toLowerCase()}@showup.io`,
    username: `${firstName[0].toLowerCase()}${lastName.toLowerCase()}`,
    hashedPassword: bcrypt.hashSync('password')
  }
  userSeeds.push(obj)
})

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate(userSeeds, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users'
    return queryInterface.bulkDelete(options)
  }
};
