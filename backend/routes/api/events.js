const express = require('express')
const router = express.Router()

const { Event, Group, Venue, EventImage, User } = require('../../db/models')

router.get('/', async (req, res) => {
  const events = await Event.findAll({
    include: [
      {
        model: Group,
        attributes: ['name']
      },
      {
        model: Venue,
        attributes: ['address']
      },
      {
        model: EventImage
      }
    ]
  })

  res.json(events)
})

router.get('/users', async (req, res) => {
  const events = await Event.findAll({
    include: {
      model: User
    }
  })

  res.json(events)
})

module.exports = router
