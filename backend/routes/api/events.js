const express = require('express')
const router = express.Router()

const { Event, Group, Venue } = require('../../db/models')

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
      }
    ]
  })

  res.json(events)
})

module.exports = router
