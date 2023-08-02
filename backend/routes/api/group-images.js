const express = require('express')
const router = express.Router()

const { GroupImage, Group, User } = require('../../db/models')
const { requireAuth } = require('../../utils/auth.js')

router.delete('/:imageId', requireAuth, async (req, res, next) => {
  const image = await GroupImage.findByPk(req.params.imageId)

  if (!image) {
    res.status(404)
    return res.json({message: "Group Image couldn't be found"})
  }

  const group = await Group.findByPk(image.groupId, {
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
    if (user.Membership.status === 'co-host') {{
      authUsers.push(user.username)
    }}
  })

  if (!authUsers.includes(req.user.username)) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: 'You do not have authorization to delete this image.'}
    return next(err)
  }

  image.destroy()

  res.json({message: "Successfully deleted"})
})

router.put('/:imageId', requireAuth, async (req, res, next) => {
  const image = await GroupImage.findByPk(req.params.imageId)

  if (!image) {
    res.status(404)
    return res.json({message: "Group Image couldn't be found"})
  }

  const group = await Group.findByPk(image.groupId, {
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
    if (user.Membership.status === 'co-host') {{
      authUsers.push(user.username)
    }}
  })

  if (!authUsers.includes(req.user.username)) {
    const err = new Error('Invalid Authorization')
    err.status = 403,
    err.title = 'Invalid Authorization'
    err.errors = {message: 'You do not have authorization to delete this image.'}
    return next(err)
  }

  image.set(req.body)

  await image.save()

  res.json(image)
})

module.exports = router
