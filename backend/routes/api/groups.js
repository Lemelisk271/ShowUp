const express = require('express')
const router = express.Router()

const { Group, Venue, GroupImage } = require('../../db/models')

router.get('/', async (req, res) => {
  const groups = await Group.findAll({
    include: [
      {
        model: Venue
      },
      {
        model: GroupImage
      }
    ]
  })

  res.json(groups)
})

module.exports = router
