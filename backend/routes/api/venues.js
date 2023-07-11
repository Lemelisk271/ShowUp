const express = require('express')
const router = express.Router()

const { Venue, Group, User } = require('../../db/models')
const { requireAuth } = require('../../utils/auth.js')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation.js')

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

router.put('/:venueId', requireAuth, validateVenue, async (req, res, next) => {
  const venue = await Venue.findByPk(req.params.venueId)

  if (!venue) {
    res.status(404)
    return res.json({message: "Venue couldn't be found"})
  }

  const group = await Group.findByPk(venue.groupId, {
    include: [
      {
        model: User,
        as: 'Members'
      }
    ]
  })

  const members = group.Members

  const authUsers = []

  members.forEach(member => {
    if (member.Membership.status === 'co-host') {
      authUsers.push(member.username)
    }
  })

  if (group.organizerId !== req.user.id && !authUsers.includes(req.user.username)) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: 'You do not have authorization to edit this venue.'}
    return next(err)
  }

  venue.set(req.body)

  venue.save()

  const resObj = venue.toJSON()

  delete resObj.updatedAt

  res.json(resObj)
})

module.exports = router
