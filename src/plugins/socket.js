import VueSocketio from 'vue-socket.io-extended'
import * as io from 'socket.io-client'
import Vue from 'vue'
const isDev = process.env.NODE_ENV === 'development'
let socketConnection = process.env.VUE_APP_URL
if (isDev) {
  socketConnection = 'http://localhost'
}

export default {
  beforeStart ({ store, route }) {
    if (process.client) {
      const socketOpts = {
        transports: ['websocket'],
        autoConnect: false,
        query: { inviteID: undefined, privateID: undefined }
      }
      const socket = io(socketConnection, socketOpts)

      Vue.use(VueSocketio, socket, { store })
    }
  }
}
