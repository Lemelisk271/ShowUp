const express = require('express')
const router = express.Router()

const { Group, User, GroupImage } = require('../../db/models')
const { requireAuth } = require('../../utils/auth.js')

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

router.get('/current', requireAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    include: [
      {
        model: Group,
        as: 'GroupMembership',
        include: [
          {
            model: User,
            as: 'Members'
          },
          {
            model: GroupImage
          }
        ]
      }
    ]
  })

  const groupList = []

  user.GroupMembership.forEach(group => {
    groupList.push(group.toJSON())
  })

  groupList.forEach(group => {
    group.numMembers = group.Members.length
    group.GroupImages.forEach(image => {
      if (image.preview === true) {
        group.previewImage = image.url
      }
    })
    delete group.Membership
    delete group.Members
    delete group.GroupImages
  })

  const groupObj = {
    Groups: groupList
  }

  res.json(groupObj)
})

module.exports = router
