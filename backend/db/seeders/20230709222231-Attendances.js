'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Attendance, Event, User, Group } = require('../models')

let options = {}
if (process.env.NOD_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const events = await Event.findAll({
      include: {
        model: Group,
      }
    })
    const users = await User.findAll({
      include: {
        model: Group,
        as: 'GroupMembership'
      }
    })
    const seeds = []
    const status = ['accepted', 'declined', 'undecided']

    for (let i = 0; i < events.length; i++) {
      for (let j = 0; j < users.length; j++) {
        let GroupMembership = users[j].GroupMembership
        for (let k = 0; k < GroupMembership.length; k++) {
          let eventGroup = events[i].Group.name
          let userGroup = GroupMembership[k].name
          if (eventGroup === userGroup) {
            const obj = {
              eventId: events[i].id,
              userId: users[j].id,
              status: status[Math.floor(Math.random() * 3)]
            }
            seeds.push(obj)
          }
        }
      }
    }

    await Attendance.bulkCreate(seeds, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Attendances'
    return queryInterface.bulkDelete(options)
  }
};
