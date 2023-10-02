'use strict';

/** @type {import('sequelize-cli').Migration} */

const { User } = require('../models')
const bcrypt = require('bcryptjs')
const { fakerEN_US: faker } = require('@faker-js/faker')

let options = {}
if (process.env.NOD_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

const userSeeds = [{
  firstName: "Demo",
  lastName: "User",
  email: "duser@showup.io",
  username: "duser",
  hashedPassword: bcrypt.hashSync('password')
}]

const createRandomUser = () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const email = faker.internet.email({ firstName, lastName })

  return {
    firstName,
    lastName,
    email,
    username: `${firstName[0].toLowerCase()}${lastName.toLowerCase()}`,
    hashedPassword: bcrypt.hashSync('password')
  }
}

let users = 99

if (process.env.NODE_ENV === 'production') {
  users = 29
}

for (let i = 0; i < users; i++) {
  let user = createRandomUser()
  userSeeds.push(user)
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate(userSeeds, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users'
    return queryInterface.bulkDelete(options)
  }
};
