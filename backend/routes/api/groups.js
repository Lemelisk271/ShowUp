const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')

const { Group, User, GroupImage, Venue, Event, EventImage, Membership, Attendance } = require('../../db/models')
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
    .withMessage("A two letter state is required"),
  handleValidationErrors
]

const validateVenue = [
  check('address')
    .exists({checkFalsy: true})
    .withMessage("Street address is required"),
  check('city')
    .exists({checkFalsy: true})
    .withMessage("City is required"),
  check('state')
    .exists({checkFalsy: true})
    .isAlpha()
    .isLength({
      min: 2,
      max: 2
    })
    .isUppercase()
    .withMessage("State is required"),
  check('lat')
    .exists({checkFalsy: true})
    .isDecimal()
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({checkFalsy: true})
    .isDecimal()
    .withMessage('Latitude is not valid'),
  handleValidationErrors
]

const validateEvent = [
  check('venueId')
    .custom(async (value) => {
      if (value !== null) {
        const venue = await Venue.findByPk(value)
        if (!venue) {
          throw new Error("Venue does not exist")
        }
      }
    }),
  check('name')
    .exists({checkFalsy: true})
    .isLength({min: 5})
    .withMessage("Name must be at least 5 characters"),
  check('type')
    .exists({checkFalsy: true})
    .isIn(["Online", "In person"])
    .withMessage('Type must be Online or In person'),
  check('capacity')
    .exists({checkFalsy: true})
    .isInt()
    .withMessage("Capacity must be an integer"),
  check('price')
    .exists({checkFalsy: true})
    .isDecimal()
    .withMessage("Price is invalid"),
  check('description')
    .exists({checkFalsy: true})
    .withMessage("Description is required"),
  check('startDate')
    .exists({checkFalsy: true})
    .isAfter()
    .withMessage("Start date must be in the future"),
  check('endDate')
    .exists({checkFalsy: true})
    .isAfter(this.startDate)
    .withMessage("End date is less than start date"),
  handleValidationErrors
]

const validateMembership = [
  check('memberId')
    .custom(async (value) => {
      const user = await User.findByPk(value)
      if (!user) {
        throw new Error("User couldn't be found")
      }
    }),
    check('status')
      .isIn(['member', 'co-host'])
      .withMessage("Cannot change a membership status to pending"),
  handleValidationErrors
]

const validateMemberDelete = [
  check('memberId')
  .custom(async (value) => {
    const user = await User.findByPk(value)
    if (!user) {
      throw new Error("User couldn't be found")
    }
  }),
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

  const resObj = {
    Groups: groupList
  }

  res.json(resObj)
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
    await Membership.create({
      userId: req.user.id,
      groupId: group.id,
      status: 'host'
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
    return res.json({message: "Group couldn't be found"})
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

router.put('/:groupId', requireAuth, validateGroup, async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId)

  if (!group) {
    res.status(404)
    return res.json({message: "Group couldn't be found"})
  }

  if (group.organizerId !== req.user.id) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: 'You do not have authorization to update the selected group.'}
    return next(err)
  }

  group.set(req.body)

  await group.save()

  res.json(group)
})

router.delete('/:groupId', requireAuth, async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId)

  if (!group) {
    res.status(404)
    return res.json({message: "Group couldn't be found"})
  }

  if (group.organizerId !== req.user.id) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: 'You do not have authorization to delete the selected group.'}
    return next(err)
  }

  await group.destroy()

  res.status(200)
  res.json({message: 'Successfully deleted'})
})

router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: User,
        as: 'Members'
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

  const members = group.Members

  const authUsers = []

  members.forEach(member => {
    if (member.Membership.status === 'co-host' || member.Membership.status === 'host') {
      authUsers.push(member.username)
    }
  })

  if (group.organizerId !== req.user.id && !authUsers.includes(req.user.username)) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: 'You do not have authorization to view the selected group.'}
    return next(err)
  }

  const venues = {
    Venues: group.Venues
  }

  res.json(venues)
})

router.post('/:groupId/venues', requireAuth, validateVenue, async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: User,
        as: 'Members'
      }
    ]
  })

  if (!group) {
    res.status(404)
    return res.json({message: "Group couldn't be found"})
  }

  const members = group.Members

  const authUsers = []

  members.forEach(member => {
    if (member.Membership.status === 'co-host' || member.Membership.status === 'host') {
      authUsers.push(member.username)
    }
  })

  if (group.organizerId !== req.user.id && !authUsers.includes(req.user.username)) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: 'You do not have authorization to add a venue to the selected group.'}
    return next(err)
  }

  const venue = await group.createVenue(req.body)

  const resObj = {
    id: venue.id,
    groupId: group.id,
    address: venue.address,
    city: venue.city,
    state: venue.state,
    lat: venue.lat,
    lng: venue.lng
  }

  res.json(resObj)
})

router.get('/:groupId/events', async (req, res) => {
  const group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: Event,
        attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate'],
        include: [
          {
            model: User
          },
          {
            model: EventImage
          },
          {
            model: Group,
            attributes: ['id', 'name', 'city', 'state']
          },
          {
            model: Venue,
            attributes: ['id', 'city', 'state']
          }
        ]
      }
    ]
  })

  if (!group) {
    res.status(404)
    return res.json({message: "Group couldn't be found"})
  }

  const events = group.Events

  const eventList = []

  events.forEach(event => {
    eventList.push(event.toJSON())
  })

  eventList.forEach(event => {
    let count = 0
    event.Users.forEach(user => {
      if (['attending'].includes(user.Attendance.status)) {
        count++
      }
    })
    event.numAttending = count
    event.EventImages.forEach(image => {
      if (image.preview === true) {
        event.previewImage = image.url
      }
    })
    if (!event.previewImage) {
      event.previewImage = 'No image found'
    }
    delete event.EventImages
    delete event.Users
  })

  const eventObj = {
    Events: eventList
  }

  res.json(eventObj)
})

router.post('/:groupId/events', requireAuth, validateEvent, async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: User,
        as: 'Members'
      }
    ]
  })

  if (!group) {
    res.status(404)
    return res.json({message: "Group couldn't be found"})
  }

  const authUsers = []

  group.Members.forEach(user => {
    if (user.Membership.status === 'co-host' ||user.Membership.status === 'host') {
      authUsers.push(user.username)
    }
  })

  if (group.organizerId !== req.user.id && !authUsers.includes(req.user.username)) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: 'You do not have authorization to add a venue to the selected group.'}
    return next(err)
  }

  const event = await group.createEvent(req.body)

  const attendObj = {
    eventId: event.id,
    userId: req.user.id,
    status: 'host'
  }

  await Attendance.create(attendObj)

  const resObj = {
    id: event.id,
    groupId: event.groupId,
    venueId: event.venueId,
    name: event.name,
    type: event.type,
    capacity: event.capacity,
    price: event.price,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate
  }

  res.json(resObj)
})

router.get('/:groupId/members', async (req, res) => {
  const group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: User,
        as: 'Members',
        attributes: ['id', 'firstName', 'lastName'],
        through: {
          attributes: ['status']
        }
      }
    ]
  })

  if (!group) {
    res.status(404)
    return res.json({message: "Group couldn't be found"})
  }

  const resObj = {}

  const memberArray = []

  group.Members.forEach(user => {
    if (user.Membership.status !== 'pending') {
      memberArray.push(user)
    }
  })

  resObj.Members = memberArray

  if (req.user) {
    if (req.user.id === group.organizerId) {
      resObj.Members = group.Members
    }
  }

  res.json(resObj)
})

router.post('/:groupId/membership', requireAuth, async (req, res) => {
  const group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: User,
        as: 'Members'
      }
    ]
  })

  if (!group) {
    res.status(404)
    return res.json({message: "Group couldn't be found"})
  }

  const members = {}

  group.Members.forEach(user => {
    members[user.username] = user.Membership.status
  })

  const memObj = {
    userId: req.user.id,
    groupId: group.id
  }

  if (members[req.user.username] === 'pending') {
    res.status(400)
    return res.json({message: "Membership has already been requested"})
  }

  if (members[req.user.username] === 'member' || members[req.user.username] === 'co-host' || members[req.user.username] === 'host') {
    res.status(400)
    return res.json({message: "User is already a member of the group"})
  }

  const membership = await Membership.build(memObj)
  membership.validate()
  membership.save()

  const resObj = {
    groupId: membership.groupId,
    memberId: membership.userId,
    status: membership.status
  }

  res.json(resObj)
})

router.put('/:groupId/membership', requireAuth, validateMembership, async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: User,
        as: 'Organizer'
      },
      {
        model: User,
        as: 'Members'
      }
    ]
  })

  if (!group) {
    res.status(404)
    return res.json({message: "Group couldn't be found"})
  }

  const organizer = group.Organizer.username
  const authUsers = []
  const pendingUsers = []

  group.Members.forEach(user => {
    if (user.Membership.status === 'co-host' || user.Membership.status === 'host') {
      authUsers.push(user.username)
    }
    if (user.Membership.status === 'pending') {
      pendingUsers.push(user.id)
    }
  })

  if (!pendingUsers.includes(req.body.memberId)) {
    res.status(404)
    return res.json({message: "Membership between the user and the group does not exist"})
  }

  if (req.body.status === 'co-host' && (req.user.username !== organizer)) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: 'You do not have authorization to change a member to co-host'}
    return next(err)
  }

  if ((req.body.status === 'member') && (!authUsers.includes(req.user.username) && (req.user.username !== organizer))) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: "You do not have authorization to change a member's status"}
    return next(err)
  }

  const membership = await Membership.findOne({
    attributes: ['id', 'userId', 'groupId', 'status'],
    where: {
      [Op.and]: [
        {userId: req.body.memberId},
        {groupId: group.id}
      ]
    }
  })

  const updateObj = {
    status: req.body.status
  }

  membership.set(updateObj)

  await membership.save()

  const resObj = {
    id: membership.id,
    groupId: membership.groupId,
    memberId: membership.userId,
    status: membership.status
  }

  res.json(resObj)
})

router.delete('/:groupId/membership', requireAuth, validateMemberDelete, async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId, {
    include: [
      {
        model: User,
        as: 'Organizer'
      }
    ]
  })

  if (!group) {
    res.status(404)
    return res.json({message: "Group couldn't be found"})
  }

  const membership = await Membership.findOne({
    where: {
      [Op.and]: [
        {
          userId: req.body.memberId
        },
        {
          groupId: req.params.groupId
        }
      ]
    }
  })

  if (!membership) {
    res.status(404)
    return res.json({message: "Membership does not exist for this User"})
  }

  const user = await User.findByPk(req.body.memberId)

  const authUsers = [group.Organizer.username, user.username]

  if (!authUsers.includes(req.user.username)) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: "You do not have authorization to delete a member from this group"}
    return next(err)
  }

  membership.destroy()

  res.json({message: "Successfully deleted membership from group"})
})

module.exports = router
