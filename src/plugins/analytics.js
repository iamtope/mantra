import VueAnalytics from 'vue-analytics'
import Vue from 'vue'
const isDev = process.env.NODE_ENV === 'development'

export default {
  beforeCreate ({ router }) {
    Vue.use(VueAnalytics, {
      id: process.env.VUE_APP_GOOGLE_ID,
      router,
      set: [{ field: 'anonymizeIp', value: true }],
      disabled: true,
      debug: {
        enabled: !isDev, // default value
        trace: false, // default value
        sendHitTask: !isDev // default value
      }
    })
  }
}
