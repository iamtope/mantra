import axios from 'axios'
import { createHash } from 'crypto'
import get from 'lodash/get'
import User from '../database/User'
const apiKey = process.env.MAILCHIMP_API_KEY
const listID = process.env.MAILCHIMP_LIST

const dc = apiKey.split('-')[1]
axios.defaults.headers.common['Authorization'] = `apikey ${apiKey}`
axios.defaults.baseURL = `https://${dc}.api.mailchimp.com/3.0/`

const listBasePath = `lists/${listID}/members`
/**
 *
 * @param {String} email - Email des members bei mailchimp
 * @param {Object} mergeFields - Custom mailchimp fields
 * @returns promise
 */

const mailchimp = {}

mailchimp.addMember = (email, mergeFields) => {
  return axios.post(`${listBasePath}`, {
    email_address: email,
    status: 'pending',
    merge_fields: mergeFields
  })
}
/**
 *
 * @param {String} email
 * @param {String} [status=pending]
 * @returns Promise
 */
mailchimp.setMemberStatus = (email, status = 'pending') => {
  const subscriberHash = _getUserEmailAsHash(email)
  return axios.patch(`${listBasePath}/${subscriberHash}`, {
    status
  })
}

/**
 * @param {*} memberEmail
 * @returns Promise
 */
mailchimp.getMember = memberEmail => {
  const email = _getUserEmailAsHash(memberEmail)

  return axios.get(`${listBasePath}/${email}`)
}

/**
 * @description Resubscribe einen Member ( status wird auf pending gestellt )
 * @param {String} memberEmail
 */
mailchimp.resubscribeMember = memberEmail => {
  const email = _getUserEmailAsHash(memberEmail)
  return axios.put(`${listBasePath}/${email}`, { status: 'pending' })
}

async function webhookListener (req, res) {
  const body = req.body
  const mailchimpFields = req.body.data.merges
  const type = body.type
  const ref = get(mailchimpFields, 'REF', false)
  if (['pending', 'subscribe', 'unsubscribe'].includes(type)) {
    const invitedUser = await User.findOneAndUpdate(
      { _id: mailchimpFields.MONGO_ID },
      { $set: { status: type } },
      { new: true }
    )
      .select('updatedAt')
      .catch(_ => {})

    req.io.to(mailchimpFields.P_LINK).emit('UPDATE_OWN', type)
    if (ref && ref !== '-') {
      const inviter = await User.findOne({ privateID: ref })
      const invitedUserCount = await User.countDocuments({
        refID: ref,
        status: 'subscribe'
      })
      let socketResponse = {
        count: invitedUserCount,
        status: type,
        _id: mailchimpFields.MONGO_ID,
        firstName: mailchimpFields.FNAME,
        updatedAt: invitedUser.updatedAt
      }
      req.io.to(inviter.privateID).emit('activity', socketResponse)
    }
  }

  res.send('ok')
}

function _getUserEmailAsHash (email) {
  return createHash('md5')
    .update(email)
    .digest('hex')
}
async function setup () {
  const fields = `lists/${listID}/merge-fields`

  const promises = [
    axios.post(fields, {
      name: 'Referal',
      type: 'text',
      tag: 'REF',
      public: false
    }),
    axios.post(fields, {
      name: 'Mongo id',
      type: 'text',
      tag: 'MONGO_ID',
      public: false
    }),
    axios.post(fields, {
      name: 'Private link',
      type: 'text',
      tag: 'P_LINK',
      public: false
    }),
    axios.post(fields, {
      name: 'Invite link',
      type: 'text',
      tag: 'I_LINK',
      public: false
    })
  ]

  await Promise.all(promises).catch(_ => {})
}
export { setup, webhookListener, mailchimp }
