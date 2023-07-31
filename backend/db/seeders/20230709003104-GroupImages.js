'use strict';

/** @type {import('sequelize-cli').Migration} */

const { GroupImage, Group } = require('../models')

let options = {}
if (process.env.NOD_ENV === 'production') {
  options.schema = process.env.SCHEMA
}

const groupImageSeeds = [
  {
    group: 'Seattle AI Society',
    url: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/Advantages_and_Disadvantages_of_artificial_intelligence.jpg',
    preview: true
  },
  {
    group: 'Seattle AI Society',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Artificial_Intelligence_%26_AI_%26_Machine_Learning_-_30212411048.jpg/1024px-Artificial_Intelligence_%26_AI_%26_Machine_Learning_-_30212411048.jpg'
  },
  {
    group: 'Seattle AI Society',
    url: 'https://www.europarl.europa.eu/resources/library/images/20230607PHT95601/20230607PHT95601-cl.jpg'
  },
  {
    group: 'The Eastside RPG & D&D Meetup Group',
    url: 'https://cdn.vox-cdn.com/thumbor/dwntSToz5bI1sAKGDBFZfC89wN4=/0x0:2048x1488/1520x0/filters:focal(0x0:2048x1488):format(webp):no_upscale()/cdn.vox-cdn.com/uploads/chorus_asset/file/22678876/Party_Art.jpg',
    preview: true
  },
  {
    group: 'The Eastside RPG & D&D Meetup Group',
    url: 'https://assetsio.reedpopcdn.com/dnd-cleric-images-7.jpg?width=848&quality=80&format=jpg&auto=webp'
  },
  {
    group: 'The Eastside RPG & D&D Meetup Group',
    url: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/03/d-d-tiefling-cosplay-ideas.jpg?q=50&fit=contain&w=1140&h=&dpr=1.5'
  },
  {
    group: 'No FOMO',
    url: 'https://static01.nyt.com/images/2018/02/08/fashion/01boite1/01boite1-superJumbo.jpg',
    preview: true
  },
  {
    group: 'No FOMO',
    url: 'https://bidroom.com/blog/wp-content/uploads/2018/10/Untitled-design-50.png'
  },
  {
    group: 'No FOMO',
    url: 'https://global-uploads.webflow.com/5e2b8863ba7fff8df8949888/5ea9e30fffb63e8a8c680097_5e28eba392705934723f4d4c_dance-at-a-club.png'
  },
  {
    group: 'PNW Dev Network',
    url: 'https://www.zdnet.com/a/img/resize/adcb2eb2cc3f5562f7e80931308e2a08b01947ce/2019/08/19/4a663776-f4a9-4f89-9bee-2d07ee052f5b/istock-1147195672-11.jpg?auto=webp&fit=crop&height=900&width=1200',
    preview: true
  },
  {
    group: 'PNW Dev Network',
    url: 'https://www.usnews.com/dims4/USNEWS/af66e3c/2147483647/crop/2000x1313+0+0/resize/640x420/quality/85/?url=https%3A%2F%2Fwww.usnews.com%2Fcmsmedia%2Ff9%2Ff1%2Fa6174c87479b8222c09903d7651c%2F190219-softwaredevelopers-stock.jpg'
  },
  {
    group: 'PNW Dev Network',
    url: 'https://assets.entrepreneur.com/content/3x2/2000/1593079102-work-731198.jpg'
  },
  {
    group: 'Seattle Good Food Meetup Group',
    url: 'https://d1ralsognjng37.cloudfront.net/28b8e4ac-7552-49a5-aab1-76d8aaebd0e2.jpeg',
    preview: true
  },
  {
    group: 'Seattle Good Food Meetup Group',
    url: 'https://images.seattletimes.com/wp-content/uploads/2020/09/09052020_12_210802.jpg?d=780x585'
  },
  {
    group: 'Seattle Good Food Meetup Group',
    url: 'https://www.ddir.com/wp-content/uploads/2018/04/Dicks-Drive-In-Deluxe-13.jpg'
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    for (let img of groupImageSeeds) {
      const group = await Group.findOne({
        where: {
          name: img.group
        }
      })
      img.groupId = group.id
    }
    await GroupImage.bulkCreate(groupImageSeeds, {validate: true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'GroupImages'
    return queryInterface.bulkDelete(options)
  }
};
