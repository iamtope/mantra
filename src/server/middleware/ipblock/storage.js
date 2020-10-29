module.exports = class MemoryStorage {
  /**
   *
   * @param {Date} resetTime
   */
  constructor (resetTime) {
    this.hits = {}
  }

  increment (key, time, cb) {
    if (this.hits[key]) {
      this.hits[key].value++
    } else {
      this.hits[key] = {
        value: 1,
        timeoutID: null,
        createdAt: new Date()
      }

      if (!this.hits[key].timeoutID) {
        this.hits[key].timeoutID = setTimeout(() => {
          this.delete(key)
        }, time)
      }
    }
    const { value, createdAt } = this.hits[key]
    cb(null, { value, createdAt })
  }
  decrement (key) {
    if (this.hits[key].value) {
      this.hits[key].value--
    }
  }
  delete (key) {
    if (this.hits[key]) {
      clearTimeout(this.hits[key].timeoutID)
      delete this.hits[key]
    }
  }
}
