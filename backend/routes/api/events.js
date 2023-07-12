const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const { check } = require('express-validator')

const { Event, Group, Venue, User, EventImage, Attendance } = require('../../db/models')
const { requireAuth } = require('../../utils/auth.js')
const { handleValidationErrors } = require('../../utils/validation.js')

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

router.get('/', async (req, res) => {
  const events = await Event.findAll({
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
  })

  const eventList = []

  events.forEach(event => {
    eventList.push(event.toJSON())
  })

  eventList.forEach(event => {
    let count = 0
    event.Users.forEach(user => {
      if (['attending', 'waitlist', 'pending'].includes(user.Attendance.status)) {
        count++
      }
    })
    event.numAttending = count
    event.EventImages.forEach(image => {
      if (image.preview = true) {
        event.previewImage = image.url
      }
    })
    if (!event.previewImage) {
      event.previewImage = 'No image found'
    }
    delete event.Users
    delete event.EventImages
  })

  const resObj = {
    Events: eventList
  }

  res.json(resObj)
})

router.get('/:eventId', async (req, res) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: [
      {
        model: User,
        through: {
          where: {
            status: {
              [Op.in]: ['attending', 'waitlist', 'pending']
            }
          }
        }
      },
      {
        model: Group,
        attributes: ['id', 'name', 'private', 'city', 'state']
      },
      {
        model: Venue,
        attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
      },
      {
        model: EventImage,
        attributes: ['id', 'url', 'preview']
      }
    ]
  })

  if (!event) {
    res.status(404)
    return res.json({message: "Event couldn't be found"})
  }

  const jsonEvent = event.toJSON()

  jsonEvent.numAttending = jsonEvent.Users.length

  delete jsonEvent.Users

  res.json(jsonEvent)
})

router.post('/:eventId/images', requireAuth, async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: [
      {
        model: User,
        through: {
          where: {
            status: {
              [Op.in]: ['attending', 'waitlist', 'pending']
            }
          }
        }
      }
    ]
  })

  if (!event) {
    res.status(404)
    return res.json({message: "Event couldn't be found"})
  }

  const jsonEvent = event.toJSON()

  const authUsers = []

  jsonEvent.Users.forEach(user => {
    authUsers.push(user.username)
  })

  if (!authUsers.includes(req.user.username)) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: 'You do not have authorization to add an image to the event.'}
    return next(err)
  }

  const image = await event.createEventImage(req.body)

  const resObj = {
    id: image.id,
    url: image.url,
    preview: image.preview
  }

  res.json(resObj)
})

router.put('/:eventId', requireAuth, validateEvent, async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: [
      {
        model: User,
        through: {
          where: {
            status: 'co-host'
          }
        }
      }
    ]
  })

  if(!event) {
    res.status(404)
    return res.json({message: "Event couldn't be found"})
  }

  const venue = await Venue.findByPk(req.body.venueId)

  if (!venue) {
    res.status(404)
    return res.json({message: "Venue couldn't be found"})
  }

  const group = await Group.findByPk(event.groupId)

  const authUsers = []

  if (group.organizerId === req.user.id) {
    authUsers.push(req.user.username)
  }

  event.Users.forEach(user => {
    authUsers.push(user.username)
  })

  if (!authUsers.includes(req.user.username)) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: 'You do not have authorization to edit this event.'}
    return next(err)
  }

  event.set(req.body)

  await event.save()

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

router.delete('/:eventId', requireAuth, async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: [
      {
        model: User,
        through: {
          where: {
            status: 'co-host'
          }
        }
      }
    ]
  })

  if (!event) {
    res.status(404)
    return res.json({message: "Event couldn't be found"})
  }

  const group = await Group.findByPk(event.groupId)

  const authUsers = []

  if (group.organizerId === req.user.id) {
    authUsers.push(req.user.username)
  }

  if (!authUsers.includes(req.user.username)) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: 'You do not have authorization to edit this event.'}
    return next(err)
  }

  event.destroy()

  res.status(200)
  res.json({message: "Successfully Deleted"})
})

router.get('/:eventId/attendees', async (req, res) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
        through: {
          attributes: ['status']
        }
      }
    ]
  })

  if (!event) {
    res.status(404)
    return res.json({message: "Event couldn't be found"})
  }

  const group = await Group.findByPk(event.groupId, {
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

  const authUsers = [group.Organizer.username]

  group.Members.forEach(user => {
    if (user.Membership.status === 'co-host') {
      authUsers.push(user.username)
    }
  })

  const attendees = []

  event.Users.forEach(user => {
    if (user.Attendance.status !== 'pending') {
      attendees.push(user)
    }
  })

  const resObj = {
    Attendees: attendees
  }

  if (authUsers.includes(req.user.username)) {
    resObj.Attendees = event.Users
  }

  res.json(resObj)
})

router.post('/:eventId/attendance', requireAuth, async(req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: [
      {
        model: User
      }
    ]
  })

  if (!event) {
    res.status(404)
    return res.json({message: "Event couldn't be found"})
  }

  const group = await Group.findByPk(event.groupId, {
    include: [
      {
        model: User,
        as: 'Members'
      }
    ]
  })

  const members = []
  const pending = []
  const attending = []

  group.Members.forEach(member => {
    members.push(member.username)
  })

  if (!members.includes(req.user.username)) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: 'You do not have authorization to attend this event.'}
    return next(err)
  }


  event.Users.forEach(user => {
    if (user.Attendance.status === 'pending') {
      pending.push(user.username)
    }
    if (user.Attendance.status === 'attending' || user.Attendance.status === 'waitlist') {
      attending.push(user.username)
    }
  })

  if (pending.includes(req.user.username)) {
    res.status(400)
    return res.json({message: "Attendance has already been requested"})
  }

  if (attending.includes(req.user.username)) {
    res.status(400)
    return res.json({message: "User is already an attendee of the event"})
  }

  const attend = await Attendance.build({eventId: event.id, userId: req.user.id})

  attend.validate()

  attend.save()

  const resObj = {
    eventId: attend.eventId,
    userId: attend.userId,
    status: attend.status
  }

  res.json(resObj)
})

module.exports = router
