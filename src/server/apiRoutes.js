import express from 'express'
import { body, validationResult, param } from 'express-validator/check'
import { sendRecover, sendInvite } from './services/email'
import shortid from 'shortid'
import User from './database/User'
import makeinviteID from './services/random'
import { removeTrailingSlash } from './utils'

import { mailchimp } from './services/mailchimp'
import ipblocker from './middleware/ipblock/middleware'
import qs from 'querystring'
import ms from 'ms'

const asyncHandler = require('express-async-handler')
shortid.characters(
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@'
)

const blocker = ipblocker({
  windowMs: ms(process.env.LIMIT_TIMEOUT),
  max: Number(process.env.LIMIT_MAX),
  disabled: false
})

const APP_URL = removeTrailingSlash(process.env.APP_URL)
const router = express.Router()

/**
 * Ladet den User wenn er ein Cookie besitzt
 */
router.get(
  '/user/:privateID',
  asyncHandler(async (req, res, next) => {
    const userInfo = await User.findOne({ privateID: req.params.privateID })
    if (userInfo) {
      res.status(200).json({ userInfo })
    } else {
      res.status(404).json()
    }
  })
)

/**
 * Erstellt einen benutzer mit dem Vornamen und return die Private id
 */
router.post(
  '/user/add/firstname',
  blocker,
  body('firstName')
    .not()
    .isEmpty()
    .withMessage('No Firstname')
    .trim()
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() })
    }

    const firstName = req.body.firstName

    const refID = req.body.refID ? req.body.refID : '-'
    const privateIDFromRequest = req.body.privateID

    if (privateIDFromRequest) {
      const privateIDExists = User.findOne({ privatID: privateIDFromRequest })
      if (privateIDExists) {
        // Update den User
        const inviteID = await makeinviteID(firstName.toLowerCase())

        const newUser = await User.findOneAndUpdate(
          { privateID: privateIDFromRequest },
          { $set: { firstName, inviteID } },
          { new: true }
        )

        return res.status(200).json(newUser)
      } else {
        return res.status(404).json({ error: 'Private id not found' })
      }
    }

    const inviteID = await makeinviteID(firstName.toLowerCase())
    const privateID = shortid.generate()

    const invitedUser = new User({
      firstName,
      inviteID,
      privateID,
      status: 'firstName'
    })

    if (refID && refID !== '-') {
      const inviter = await User.findOne({ inviteID: refID })
      invitedUser.refID = inviter.privateID
      const status = 'firstName'
      await invitedUser.save()

      let socketResponse = {
        _id: invitedUser._id,
        firstName: invitedUser.firstName,
        status,
        updatedAt: invitedUser.updatedAt
      }

      req.io.to(inviter.privateID).emit('activity', socketResponse)
    } else {
      await invitedUser.save()
    }

    res.status(200).json(invitedUser.toJSON())
  })
)

/* Update die User email */
router.patch(
  '/user/update/email/:privateID?',
  [
    param('privateID')
      .not()
      .isEmpty()
      .withMessage('No Privatelink'),
    body('email')
      .isEmail()
      .normalizeEmail({ gmail_remove_subaddress: false })
      .withMessage('Bitte geben sie eine gültige Email ein')
  ],
  asyncHandler(async (req, res, next) => {
    const privateID = req.params.privateID
    const email = req.body.email
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() })
    }

    const userByEmail = await User.findOne({ email })

    const removeNewUser = () => {
      return User.deleteOne({ privateID })
    }

    let error = ''

    let success = {}
    const makeSuccessResponse = successObj => {
      const successDefault = {
        modal: false,
        user: {},
        redirect: false,
        status: 'firstName'
      }

      return { ...successDefault, ...successObj }
    }

    if (userByEmail) {
      switch (userByEmail.status) {
        case 'subscribe':
          await removeNewUser()
          // Send Email
          console.log('Send Private link per transaction mail')
          success = makeSuccessResponse({
            status: 'subscribe',
            modal: 'recoverlink'
          })
          break

        case 'pending':
          await removeNewUser()
          await mailchimp
            .setMemberStatus(userByEmail.email, 'pending')
            .then(res => {
              success = makeSuccessResponse({
                status: 'pending',
                redirect: false,
                modal: 'pendinginfo'
              })
            })
            .catch(err => {
              error = err
            })
          break

        case 'unsubscribe':
          await removeNewUser()
          await mailchimp
            .setMemberStatus(userByEmail.email, 'pending')
            .then(res => {
              success = {
                status: 'unsubscribe',
                redirect: { params: { privateID: userByEmail.privateID } },
                user: userByEmail.toJSON()
              }
            })
            .catch(err => {
              error = err
            })

          break
      }

      if (error.length > 0) {
        res.status(500).json({ error })
      } else {
        res.status(200).json(success)
      }
    } else {
      // Kein user
      try {
        const updatedUser = await User.findOneAndUpdate(
          { privateID },
          {
            $set: {
              status: 'pending',
              email,
              confirmedEmail: true
            }
          },
          { new: true }
        )

        const mailChimpMergeFields = {
          MONGO_ID: updatedUser._id,
          P_LINK: updatedUser.privateID,
          I_LINK: updatedUser.inviteID,
          FNAME: updatedUser.firstName
        }

        const refer = await User.findOne({ privateID: updatedUser.refID })
        if (refer) {
          mailChimpMergeFields.REF = refer.privateID
        } else {
          mailChimpMergeFields.REF = '-'
        }

        await mailchimp.addMember(updatedUser.email, mailChimpMergeFields)
        if (refer) {
          let socketResponse = {
            status: 'pending',
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            updatedAt: updatedUser.updatedAt
          }

          req.io.to(refer.privateID).emit('activity', socketResponse)
        }
        res.status(200).json(
          makeSuccessResponse({
            user: updatedUser.toJSON(),
            redirect: {
              params: { privateID: updatedUser.privateID },
              query: { thankyou: true }
            }
          })
        )
      } catch (error) {
        res.status(500).json({ error })
      }
    }
  })
)
/**
 * Holt den User  über die Private ID wenn dieser seine eigene Seite aufruft
 */
router.get(
  '/user-extended/:privateID?',
  [param('privateID').escape()],
  asyncHandler(async (req, res) => {
    const privateID = req.params.privateID

    const user = await User.findOne({ privateID }).select('-email')
    // Wenn der user seine eigene Email nicht bestätigt hat wird einfach 404 geschickt und auf Startseite umgeleitet
    if (!user || !user.confirmedEmail) {
      return res.status(404).json({
        error: 'Privat link nicht gefunden'
      })
    }

    try {
      const subscriberCounter = await User.countDocuments({
        refID: user.privateID,
        status: 'subscribe'
      })

      let activities = await User.find({
        refID: user.privateID,
        status: { $nin: ['unsubscribe', '-'] }
      })
        .sort({
          updatedAt: -1
        })
        .select('firstName status updatedAt email')

      activities = activities.map(activity => {
        let result = { ...activity.toJSON() }
        if (result.status !== 'invitedByEmail') {
          delete result.email
        }
        return result
      })

      const response = {
        userInfo: user.toJSON(),
        subscriberCounter,
        activities
      }

      res.status(200).json(response)
    } catch (error) {
      console.log(error)
    }
  })
)

/**
 * Prüft ob ein Ref link vorhanden ist wenn ein Reflink gesetzt wurde im Client
 */
router.post(
  '/checkRef/:inviteID',
  asyncHandler(async (req, res, next) => {
    const alreadyCounted = req.body.alreadyCounted
    const privateID = req.body.privateID || false
    const isBot = req.body.isBot
    const inviteID = req.params.inviteID
    const user = await User.findOne({ inviteID })
    let counted = false
    if (!user) return res.status(404).json()
    const isOwnHit = privateID === user.privateID

    if (!alreadyCounted && !isBot) {
      if (!isOwnHit) {
        await user.updateOne({ $inc: { anonymCount: 1 } })
        req.io.to(user.privateID).emit('anonymVisit')
        counted = true
      }
    }
    return res
      .status(200)
      .json({ success: true, counted, refName: user.firstName })
  })
)

/**
 * Recover für Email
 */
router.post(
  '/recover',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
  ],
  asyncHandler(async (req, res) => {
    const userEmail = req.body.email

    try {
      const user = await User.findByEmail(userEmail)
      const recoverLink = `${APP_URL}/refer/${user.privateID}`
      try {
        await sendRecover('Subject', user.email, {
          firstName: user.firstName,
          recoverLink
        })
        return res.status(200).send({ success: true })
      } catch (error) {}
      // Todo: email absenden mit dem privat link un dem user feeedback geben
    } catch (error) {
      res.status(404).send({ errors: 'Email not found' })
    }
  })
)

/**
 * Updated die Invite id wenn diese noch nicht vorhanden ist
 */
router.patch(
  '/user/update/invite-id/:privateID',
  [
    param('privateID')
      .not()
      .isEmpty()
      .withMessage('No Privatelink'),
    body('newInviteID')
      .not()
      .isEmpty()
      .withMessage('No InviteID')
      .trim()
  ],
  asyncHandler(async (req, res, next) => {
    const newInviteID = req.body.newInviteID
    const privateID = req.params.privateID
    const user = await User.findOne({ inviteID: newInviteID })

    if (user) {
      res.status(422).json({ success: false })
    } else {
      const updatedUser = await User.findOneAndUpdate(
        { privateID },
        { $set: { inviteID: newInviteID } },
        { new: true }
      )

      res.status(200).json(updatedUser)
    }
  })
)
/**
 * Email Invite
 */
router.post(
  '/invite/:privateID',
  [
    param('privateID')
      .not()
      .isEmpty()
      .withMessage('No Privatelink')
  ],
  asyncHandler(async (req, res, next) => {
    const emails = req.body.emails
    const inviteID = req.body.inviteID
    const privateID = req.params.privateID

    const inviter = await User.findOne({ privateID })

    /**
     * Input: [email@host.com, franz@host.com]
     * 1. Prüfen ob der user schon in der Datenbank ist
     */

    const newUsers = []
    for (const email of emails) {
      const user = await User.findOne({ email })
      // Pending funktioniert nicht
      if (
        !user ||
        (user.status === 'invitedByEmail' && user.refID !== privateID)
      ) {
        const newUserData = {
          email,
          privateID: shortid.generate(),
          refID: privateID,
          status: 'invitedByEmail',
          invitedByEmail: true,
          confirmedEmail: false
        }

        try {
          const newUser = await User.updateOne({ email }, newUserData, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          })

          const inviteLinkQuery = qs.stringify({
            private: newUserData.privateID
          })
          const inviteLink = `${APP_URL}/r/${inviteID}?${inviteLinkQuery}`

          console.log(`Send invite email to: ${email} ${inviteLink}`)

          await sendInvite(
            `Hallo du wurdest von: ${inviter.firstName} email`,
            email,
            {
              inviterName: inviter.firstName,
              inviteLink
            }
          ).then(_ => {
            newUsers.push(newUser)
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
    res.status(200).json(newUsers)
  })
)

export default router
