import bodyParser from 'body-parser'
import routes from './apiRoutes'
import { connect } from './database/connect'
import morgan from 'morgan'
import authRoutes from './authRoutes'
import { setup as mailchimpSetup, webhookListener } from './services/mailchimp'
import createLocaleMiddleware from 'express-locale'
import cors from 'cors'
const Sentry = require('@sentry/node')

var useragent = require('express-useragent')
const mailchimpListenerPath = process.env.MAILCHIMP_LISTENER_URL // mailchimp webhook listener route
export default {
  install (server) {
    const io = require('socket.io')(process.env.SOCKET_PORT)
    connect()
    mailchimpSetup()
    if (!process.dev) {
      Sentry.init({
        dsn: 'https://f57cb331d387488ebc2b70d4e6e31e56@sentry.io/1418213'
      })
    }
    const app = server.getApp()
    if (!process.dev) {
      app.use(Sentry.Handlers.requestHandler())
    }
    app.use(cors())

    app.use(useragent.express())
    app.use(createLocaleMiddleware())
    io.on('connection', client => {
      /* const ip = client.conn.remoteAddress
      const inviteID = client.handshake.query.inviteID
      const privateID = client.handshake.query.privateID */

      client.on('join', function (room) {
        client.join(room)
      })

      client.on('disconnect', reason => {
        console.log('disconnect')
      })
    })

    app.use(function (req, res, next) {
      req.io = io
      next()
    })

    app.use(morgan('dev'))

    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())

    app.post('/' + mailchimpListenerPath, webhookListener)

    app.use('/api/v1', routes)

    app.use(
      '/api/v1/admin',
      (req, res, next) => {
        console.log('jwt check')
        next()
      },
      authRoutes
    )
    if (!process.dev) {
      app.use(Sentry.Handlers.errorHandler())
    }
    app.use(function (err, req, res, next) {
      console.error('err', err.message) // Log error message in our server's console
      if (!err.statusCode) err.statusCode = 500 // If err has no specified error code, set error code to 'Internal Server Error (500)'
      res.status(err.statusCode).send(err.message) // All HTTP requests must have a response, so let's send back an error with its status code and message
    })
  }
}
