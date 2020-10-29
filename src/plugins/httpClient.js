/**
 * This plugin create an axios HTTP client to do request.
 * It handles tokens too to acess to private routes on API.
 */

import axios from 'axios'

export default {
  beforeCreate (context, inject) {
    const apiUrl = process.env.APP_URL || 'http://localhost:8080'

    // Create axios client
    const http = axios.create({
      baseURL: process.client ? '/' : apiUrl
    })

    inject('http', http)
  }
}
