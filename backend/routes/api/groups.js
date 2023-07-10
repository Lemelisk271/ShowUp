const express = require('express')
const router = express.Router()

const { Group, User, GroupImage, Venue } = require('../../db/models')
const { requireAuth } = require('../../utils/auth.js')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation.js')

const validateGroup = [
  check('name')
    .exists({checkFalsy: true})
    .isLength({max: 60})
    .withMessage('Name must be 60 characters or less'),
  check('about')
    .exists({checkFalsy: true})
    .isLength({min: 50})
    .withMessage('About must be 50 characters or more'),
  check('type')
    .exists({checkFalsy: true})
    .isIn(['In person', 'Online'])
    .withMessage("Type must be 'Online' or 'In person'"),
  check('private')
    .exists()
    .isIn([true, false])
    .withMessage('Private must be a boolean'),
  check('city')
    .exists({checkFalsy: true})
    .withMessage("City is required"),
  check('state')
    .exists({checkFalsy: true})
    .isLength({
      min: 2,
      max: 2
    })
    .isUppercase()
    .withMessage("State is required"),
  handleValidationErrors
]

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

router.get('/:groupId', async (req, res, next) => {
  let group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: User,
        as: 'Members'
      },
      {
        model: GroupImage,
        attributes: ['id', 'url', 'preview']
      },
      {
        model: User,
        as: 'Organizer',
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Venue
      }
    ]
  })

  if (!group) {
    res.status(404)
    return res.json({message: "Group couldn't be found"})
  }

  group = group.toJSON()

  group.numMembers = group.Members.length
  delete group.Members

  res.json(group)
})

router.post('/', requireAuth, validateGroup, async (req, res, next) => {
  const groupObj = {
    organizerId: req.user.id,
    ...req.body
  }

  try {
    const newGroup = Group.build(groupObj)
    newGroup.validate()
    await newGroup.save()
    const group = await Group.findOne({
      where: {
        name: req.body.name
      }
    })
    res.status(201)
    res.json(group)
  } catch (err) {
    return next(err)
  }
})

router.post('/:groupId/images', requireAuth, async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId)

  if (!group) {
    res.status(404)
    res.json({message: "Group couldn't be found"})
  }

  if (group.organizerId !== req.user.id) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: 'You do not have authorization to add an image to the selected group.'}
    return next(err)
  }

  const { url, preview } = req.body

  const image = await group.createGroupImage({url, preview})

  const resObj = {
    id: image.id,
    url: image.url,
    preview: image.preview
  }

  res.status(201)
  res.json(resObj)
})

module.exports = router
