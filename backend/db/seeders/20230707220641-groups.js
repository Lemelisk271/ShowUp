'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Group, User } = require('../models')

let options = {}
if (process.env.NOD_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

const groupSeeds = [
  {
    organizer: 'eanema',
    name: 'Seattle AI Society',
    about: `What we’re about
    Join us in exploring the various impacts of artificial intelligence (AI) on technology, business, relationships, creativity, and society. You'll find us playing games, sharing stories, generating new ideas, and mitigating each other's existential dread. We welcome individuals with diverse backgrounds and industries, regardless of technical knowledge.`,
    type: 'public',
    capacity: 2000,
    price: 12.99,
    startDate: new Date('2018-01-01'),
    endDate: null
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    const groupArray = []
    for (let group of groupSeeds) {
      const { organizer } = group
      const user = await User.findOne({
        where: {
          username: organizer
        }
      })
      group.organizerId = user.id
      groupArray.push(group)
    }
    await Group.bulkCreate(groupArray, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Groups'
    return queryInterface.bulkDelete(options)
  }
};
