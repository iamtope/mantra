import User from '../database/User'

export async function index (req, res, next) {
  res.status(200).json('works')
  next()
}
