import ms from 'ms'
import MemoryStorage from './storage'

export default function (settings = {}) {
  const defaults = {
    windowMs: ms('24 hours'),
    disabled: false,
    max: 3,
    statusCode: 429,
    message: 'Too Many Requests'
  }
  const options = { ...defaults, ...settings }
  options.store = options.store || new MemoryStorage()
  // Middleware
  const interceptor = function (req, res, next) {
    const key = _resolveIpAddress(req)

    if (options.disabled) {
      return next()
    }

    options.store.increment(
      key,
      options.windowMs,
      (error, { value, createdAt }) => {
        if (error) {
          next(error)
        }

        if (value === options.max + 1) {
          options.store.decrement(key)
          return res.status(options.statusCode).send(options.message)
        } else {
          return next()
        }
      }
    )
  }
  return interceptor
}

function _resolveIpAddress (req) {
  return (
    req.headers['cf-connecting-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress
  )
}
