const express = require('express')
const router = express.Router()

const { Group, Venue } = require('../../db/models')

router.get('/', async (req, res) => {
  const groups = await Group.findAll({
    include: {
      model: Venue
    }
  })

  res.json(groups)
})

module.exports = router
