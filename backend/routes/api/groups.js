const express = require('express')
const router = express.Router()

const { Group, User, GroupImage } = require('../../db/models')

router.get('/', async (req, res) => {
  const groups = await Group.findAll({
    include: [
      {
        model: User,
        as: 'Members'
      },
      {
        model: GroupImage
      }
    ]
  })

  let groupList = []

  for (let group of groups) {
    groupList.push(group.toJSON())
  }

  groupList.forEach(group => {
    group.numMembers = group.Members.length
    delete group.Members
    group.GroupImages.forEach(image => {
      if (image.preview === true) {
        group.previewImage = image.url
      }
    })
    if (!group.previewImage) {
      group.previewImage = 'No preview image found'
    }
    delete group.GroupImages
  })

  res.json(groupList)
})

module.exports = router
