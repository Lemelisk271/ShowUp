'use strict';

const { group } = require('console');
/** @type {import('sequelize-cli').Migration} */

const { Venue, Group } = require('../models')

let options = {}
if (process.env.NOD_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

const venueSeeds = [
  {
    group: 'Seattle AI Society',
    address: 'Allen Institute for Artificial Intelligence (AI2) - 2157 N Northlake Way #110',
    city: 'Seattle',
    state: 'WA',
    lat: 47.651821,
    lng: -122.329006
  },
  {
    group: 'Seattle AI Society',
    address: 'New City AI - 4111 E Madison St Ste 361',
    city: 'Seattle',
    state: 'WA',
    lat: 47.635385,
    lng: -122.278669
  },
  {
    group: 'The Eastside RPG & D&D Meetup Group',
    address: 'The Game Shelf - 12916 SE Kent-Kangley Rd',
    city: 'Kent',
    state: 'WA',
    lat: 47.389525,
    lng: -122.20163
  },
  {
    group: 'The Eastside RPG & D&D Meetup Group',
    address: 'Wizards Keep Games - 20514 108th Ave SE',
    city: 'Kent',
    state: 'WA',
    lat: 47.416867,
    lng: -122.19557
  },
  {
    group: 'No FOMO',
    address: 'Retro Rewind 80s Nightclub Bar - 15475 Ruggles St Suite 108',
    city: 'Omaha',
    state: 'NE',
    lat: 41.29534,
    lng: -96.15683
  },
  {
    group: 'No FOMO',
    address: 'Throwback Arcade Lounge - 1402 Howard St',
    city: 'Omaha',
    state: 'NE',
    lat: 41.25586,
    lng: -95.93486
  },
  {
    group: 'PNW Dev Network',
    address: 'Living Computers: Museum + Labs - 2245 1st Ave S',
    city: 'Seattle',
    state: 'WA',
    lat: 47.58265,
    lng: -122.33456
  },
  {
    group: 'PNW Dev Network',
    address: 'Titan Robotics Club - 18080 NE 68th St Suite B130',
    city: 'Redmond',
    state: 'WA',
    lat: 47.66796,
    lng: -122.09836
  },
  {
    group: 'Seattle Good Food Meetup Group',
    address: 'Europa - 29030 216th Ave SE',
    city: 'Black Diamond',
    state: 'WA',
    lat: 47.34122,
    lng: -122.05366
  },
  {
    group: 'Seattle Good Food Meetup Group',
    address: "Dick's Drive-In - 115 Broadway E",
    city: 'Seattle',
    state: 'WA',
    lat: 47.62280,
    lng: -122.32356
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    for (let venue of venueSeeds) {
      let group = await Group.findOne({
        where: {
          name: venue.group
        }
      })
      venue.groupId = group.id
    }
    await Venue.bulkCreate(venueSeeds, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Venues'
    return queryInterface.bulkDelete(options)
  }
};
