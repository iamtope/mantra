import nodemailer from 'nodemailer'
import mandrillTransporter from 'nodemailer-mandrill-transport'
import Email from 'email-templates'
import { resolve } from 'path'

const emailRoot = resolve(__dirname, '../', 'emails')

const MANDRILL_API_KEY = process.env.MANDRILL_API_KEY
const from = process.env.FROM_EMAIL

let transport
const env = process.env.NODE_ENV
if (env === 'production') {
  transport = nodemailer.createTransport(
    mandrillTransporter({
      auth: { apiKey: MANDRILL_API_KEY }
    })
  )
} else {
  // Dev Transporter
  transport = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'kifmaw3zlbfkuag2@ethereal.email',
      pass: 'GHSv1bgMcU3qjeCrgV'
    }
  })
}

const email = new Email({
  message: { from },
  send: process.prod,
  preview: true,
  transport,
  views: {
    root: emailRoot,
    options: {
      extension: 'hbs'
    }
  }
})
/**
 *
 * @param {String} subject - Email Title
 * @param {email} to - Empfänger
 * @param {object} locals - Strings die zum Template übergeben werden
 * @returns Promise
 */
export const sendRecover = (subject, to, locals) => {
  return email.send({
    template: 'recover',
    locals,
    message: {
      to,
      subject
    }
  })
}

/**
 *
 * @param {*} subject
 * @param {*} to
 * @param locals Email Template Strings
 * @param locals.inviteLink Invite Link
 * @param locals.firstName Firstname von dem Inviter
 */
export const sendInvite = (subject, to, locals) => {
  return email.send({
    template: 'invite',
    locals,
    message: {
      to,
      subject
    }
  })
}

export default email
