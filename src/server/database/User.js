import mongoose from 'mongoose'
const mongooseHidden = require('mongoose-hidden')({
  defaultHidden: { _id: false, updatedAt: false }
})

const UserSchema = new mongoose.Schema(
  {
    inviteID: { type: String, unique: true, sparse: true },
    privateID: { type: String, unique: true },
    status: {
      type: String,
      enum: [
        'pending',
        'subscribe',
        'visit',
        'unsubscribe',
        'firstName',
        'invitedByEmail'
      ],
      default: 'pending'
    },

    email: { type: String, unique: true, sparse: true, index: true },
    mailchimpStatus: { type: String },
    refID: { type: String, default: '-', hide: true },
    firstName: { type: String, default: '-' },
    lastName: { type: String, default: '-' },
    lastLogin: { type: Date, default: Date.now() },
    anonymCount: { type: Number, default: 0 },
    invitedByEmail: { type: Boolean, default: false },
    confirmedEmail: { type: Boolean, default: true }
  },
  { timestamps: true }
)

UserSchema.statics.findByEmail = async function (email) {
  const document = await this.findOne({ email })
  return document
}

UserSchema.plugin(mongooseHidden)
export default mongoose.model('User', UserSchema)
