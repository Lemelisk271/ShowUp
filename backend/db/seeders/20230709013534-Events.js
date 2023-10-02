'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Event, Venue, Group } = require('../models')

let options = {}
if (process.env.NOD_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const randomPrice = () => {
  let dollars = randomInt(1, 100)
  let cents = Math.random()
  cents = Math.round(cents * 100) / 100
  return dollars + cents
}

module.exports = {
  async up (queryInterface, Sequelize) {
    const eventSeeds = []

    const venues = await Venue.findAll({
      include: {
        model: Group
      }
    })
    const types = ['In person', 'Online']

    venues.forEach((venue, i) =>{
      let num = i + 1
      let numText
      if (num < 10) {
        numText = `0${num.toString()}`
      }
      if (num >= 10) {
        numText = num.toString()
      }

      let venueName = venue.address.split(" - ")[0]

      const obj = {
        venueId: venue.id,
        groupId: venue.groupId,
        name: `${venueName} Event`,
        description: `${venue.Group.name} - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet nunc et odio ullamcorper cursus non id sem. Etiam tortor elit, lacinia ac dignissim ac, sodales quis lacus. Nam tincidunt dui at nisi eleifend, quis suscipit sem porttitor. Proin tellus ipsum, dapibus vel lorem sit amet, tempus malesuada ex. Mauris malesuada euismod euismod. Vestibulum ligula lectus, commodo a tempus at, ullamcorper vitae arcu. Vestibulum sapien sem, imperdiet id feugiat eget, tristique non metus. In eu rutrum tortor, quis suscipit lorem.`,
        type: types[Math.floor(Math.random() * 2)],
        capacity: randomInt(100, 2000),
        price: parseFloat(randomPrice()),
        startDate: new Date(`2023-11-${numText}T12:00:00`),
        endDate: new Date(`2023-11-${numText}T14:00:00`)
      }

      eventSeeds.push(obj)

      const obj2 = {
        venueId: venue.id,
        groupId: venue.groupId,
        name: `${venueName} Event`,
        description: `${venue.Group.name} - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet nunc et odio ullamcorper cursus non id sem. Etiam tortor elit, lacinia ac dignissim ac, sodales quis lacus. Nam tincidunt dui at nisi eleifend, quis suscipit sem porttitor. Proin tellus ipsum, dapibus vel lorem sit amet, tempus malesuada ex. Mauris malesuada euismod euismod. Vestibulum ligula lectus, commodo a tempus at, ullamcorper vitae arcu. Vestibulum sapien sem, imperdiet id feugiat eget, tristique non metus. In eu rutrum tortor, quis suscipit lorem.`,
        type: types[Math.floor(Math.random() * 2)],
        capacity: randomInt(100, 2000),
        price: parseFloat(randomPrice()),
        startDate: new Date(`2023-06-${numText}T12:00:00`),
        endDate: new Date(`2023-06-${numText}T14:00:00`)
      }

      eventSeeds.push(obj2)
    })

    await Event.bulkCreate(eventSeeds, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Events'
    return queryInterface.bulkDelete(options)
  }
};
