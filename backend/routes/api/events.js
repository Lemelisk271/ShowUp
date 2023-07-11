const express = require('express')
const router = express.Router()

const { Event, Group, Venue, User, EventImage } = require('../../db/models')

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
      if (user.Attendance.status === 'accepted') {
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
            status: 'accepted'
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

module.exports = router
