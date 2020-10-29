import Vue from 'vue'
import Vuex from 'vuex'

import * as modules from './modules'
Vue.use(Vuex)
const endDate = new Date('2019-03-20').getTime()
const now = new Date().getTime()
const countdown = endDate - now
export default () => {
  return new Vuex.Store({
    state: () => ({
      app: {
        countdown
      }
    }),
    mutations: {
      SET_APP_STATE (state, { key, value }) {
        state.app[key] = value
      }
    },
    actions: {
      onHttpRequest ({ commit }, { req }) {
        commit('SET_APP_STATE', { key: 'locale', value: req.locale.language })
      }
    },
    getters: {
      showCountdown () {
        return !(now > endDate)
      }
    },

    modules: { ...modules },
    strict: process.env.NODE_ENV !== 'production'
  })
}
