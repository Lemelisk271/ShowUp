'use strict';

/** @type {import('sequelize-cli').Migration} */

const { EventImage, Event } = require('../models')

let options = {}
if (process.env.NOD_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

const images = [
  'https://images.dog.ceo/breeds/deerhound-scottish/n02092002_6180.jpg',
  'https://images.dog.ceo/breeds/retriever-flatcoated/n02099267_4331.jpg',
  'https://images.dog.ceo/breeds/redbone/n02090379_1630.jpg',
  'https://images.dog.ceo/breeds/airedale/n02096051_8937.jpg',
  'https://images.dog.ceo/breeds/hound-plott/hhh-23456.jpg',
  'https://images.dog.ceo/breeds/havanese/00100trPORTRAIT_00100_BURST20191222103956878_COVER.jpg',
  'https://images.dog.ceo/breeds/coonhound/n02089078_695.jpg',
  'https://images.dog.ceo/breeds/frise-bichon/2.jpg',
  'https://images.dog.ceo/breeds/otterhound/n02091635_1058.jpg',
  'https://images.dog.ceo/breeds/terrier-dandie/n02096437_50.jpg',
  'https://images.dog.ceo/breeds/clumber/n02101556_5831.jpg',
  'https://images.dog.ceo/breeds/setter-english/n02100735_5258.jpg',
  'https://images.dog.ceo/breeds/spaniel-japanese/n02085782_3979.jpg',
  'https://images.dog.ceo/breeds/terrier-yorkshire/n02094433_2328.jpg',
  'https://images.dog.ceo/breeds/samoyed/n02111889_2136.jpg',
  'https://images.dog.ceo/breeds/terrier-yorkshire/n02094433_3010.jpg',
  'https://images.dog.ceo/breeds/entlebucher/n02108000_3299.jpg',
  'https://images.dog.ceo/breeds/springer-english/n02102040_3462.jpg',
  'https://images.dog.ceo/breeds/terrier-norwich/n02094258_90.jpg',
  'https://images.dog.ceo/breeds/redbone/n02090379_521.jpg'
]

module.exports = {
  async up (queryInterface, Sequelize) {
    let events = await Event.findAll()
    const imageSeeds = []
    events.forEach((event, i) => {
      const obj = {
        eventId: event.id,
        url: images[i]
      }
      imageSeeds.push(obj)
    })

    await EventImage.bulkCreate(imageSeeds, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'EventImages'
    return queryInterface.bulkDelete(options)
  }
};
