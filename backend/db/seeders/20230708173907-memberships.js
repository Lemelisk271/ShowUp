'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Membership, User, Group } = require('../models')

let options = {}
if (process.env.NOD_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const memArray = []

    const groups = await Group.findAll({
      attributes: ['id', 'organizerId']
    })
    const users = await User.findAll({
      attributes: ['id']
    })

    for (let user of users) {
      for (let group of groups) {
        if (user.id === group.organizerId) {
          const obj = {
            userId: user.id,
            groupId: group.id
          }
          memArray.push(obj)
        }
      }
    }

    users.forEach((user) => {
      let firstNum = Math.floor(Math.random() * groups.length)
      let secondNum = Math.floor(Math.random() * groups.length)
      while (firstNum === secondNum || user.id == groups[firstNum].organizerId || user.id == groups[secondNum].organizerId) {
        firstNum = Math.floor(Math.random() * groups.length)
        secondNum = Math.floor(Math.random() * groups.length)
      }
      const firstObj = {
        userId: user.id,
        groupId: groups[firstNum].id
      }
      const secondObj = {
        userId: user.id,
        groupId: groups[secondNum].id
      }
      memArray.push(firstObj)
      memArray.push(secondObj)
    })

    await Membership.bulkCreate(memArray, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Memberships'
    return queryInterface.bulkDelete(options)
  }
};
