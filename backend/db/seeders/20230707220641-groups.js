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
    about: `Join us in exploring the various impacts of artificial intelligence (AI) on technology, business, relationships, creativity, and society. You'll find us playing games, sharing stories, generating new ideas, and mitigating each other's existential dread. We welcome individuals with diverse backgrounds and industries, regardless of technical knowledge.`,
    type: 'public',
    capacity: 2000,
    price: 12.99,
    startDate: new Date('2018-01-01'),
    endDate: null
  },
  {
    organizer: 'zsmith',
    name: 'The Eastside RPG & D&D Meetup Group',
    about: `Meet with local GMs who need players, players who need games, and discuss RPGs in general.`,
    type: 'private',
    capacity: 500,
    price: 5.49,
    startDate: new Date('2015-05-15'),
    endDate: null
  },
  {
    organizer: 'ispellmeyer',
    name: 'No FOMO',
    about: `NO F.O.M.O.: Seattle's Madcap Party Squad

    Alright, listen up, folks! We've got the ultimate crew for all you F.O.M.O.-phobes out there. Introducing NO F.O.M.O., the wildest, most funniest group in Seattle!

    We're here to rid you of that fear of missing out and inject some serious fun into your life. Picture this: fun activities, chill people, and zero regrets. We're all about embracing the city's vibrant scene and living it up to the max.

    Join us for a wild ride filled with art events that'll blow your mind, bar crawls that'll leave you dizzy, and karaoke nights where you'll unleash your inner superstar. Trust us, you won't find a crew more dedicated to having a blast.

    So don't waste another second hesitating. Say goodbye to F.O.M.O. and say hello to non-stop excitement with NO F.O.M.O. We're the party squad that's ready to rock your world and make every moment count. Let's do this, Seattle!`,
    type: 'public',
    capacity: 250,
    price: 59.99,
    startDate: new Date('2022-05-15'),
    endDate: null
  },
  {
    organizer: 'amiyata',
    name: 'PNW Dev Network',
    about: `We are a Meetup group and networking resource for web developers, formerly known as udevu. Join us on Discord, introduce yourself, and attend our next event.`,
    type: 'public',
    capacity: 5000,
    price: 1.29,
    startDate: new Date('2023-06-23'),
    endDate: null
  },
  {
    organizer: 'dlange',
    name: 'Seattle Good Food Meetup Group',
    about: `Let’s get together and explore local food vendors in our neighborhood. We can also have events like potluck’s or cooking sessions. All skill levels are welcome. I started this group to meet other foodie enthusiasts. Looking forward to exploring local restaurants, dine-in, and meeting new people.`,
    type: 'public',
    capacity: 2500,
    price: 12.29,
    startDate: new Date('2023-05-23'),
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
