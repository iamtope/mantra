import Admin from '../database/Admin'

export async function login (req, res, next) {}

export async function register (req, res, next) {
  const { email, password } = req.body
  try {
    const admin = await Admin.create({ email, password })
    res.status(200).json(admin)
  } catch (e) {
    console.log(e)
    res.status(500).send(e)
  }
}
