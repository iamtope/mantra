const mongoose = require('mongoose')

const connect = function () {
  return mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
}

const wipe = function () {
  connect()
  mongoose.connection.dropDatabase()
  process.exit(0)
}

module.exports = {
  connect,
  wipe
}
