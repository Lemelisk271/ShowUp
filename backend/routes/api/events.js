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
      if (['attendee', 'host', 'co-host'].includes(user.Attendance.status)) {
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

router.post('/:eventId/images')

module.exports = router
