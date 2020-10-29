import mongoose from 'mongoose'
//import bcrypt from 'bcrypt'
/**
 *
 */
const AdminSchema = new mongoose.Schema(
  {
    password: { type: String, required: true, select: false },
    email: { type: String, unique: true }
  },
  { timestamps: true }
)
/*
AdminSchema.pre('save', function (next) {
  var user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err)
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err)
        }
        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

AdminSchema.methods.comparePassword = function (pw, cb) {
  bcrypt.compare(pw, this.password, function (err, isMatch) {
    if (err) {
      return cb(err)
    }

    return cb(null, isMatch)
  })
}*/
export default mongoose.model('Admin', AdminSchema)
