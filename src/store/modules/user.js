import Vue from 'vue'
import Cookie from 'js-cookie'
import merge from 'lodash/merge'
const state = () => ({
  userInfo: {},
  requirements: {},
  /* errors: {}, */
  inviteLinkUpdateFailed: false,
  updateResponse: {},
  showSubModal: false
})

const actions = {
  async setFirstname ({ commit }, { firstName, refID, privateID = false }) {
    try {
      const res = await this.$http.post('/api/v1/user/add/firstname', {
        firstName,
        refID,
        privateID
      })

      Cookie.set('privateID', res.data.privateID)
    } catch (error) {}
  },

  async fetchExtended ({ commit }, privateID) {
    const response = await this.$http.get(`api/v1/user-extended/${privateID}`)
    commit('SET_USER', response.data)
  },

  /**
   * Holt einen Simplen user
   */
  async fetch ({ commit }, { privateID }) {
    try {
      const response = await this.$http.get(`api/v1/user/${privateID}`)

      commit('SET_USER', response.data)
    } catch (error) {
      commit('SET_ERROR', error.response.data)
    }
  },

  async update ({ commit }, { privateID, email }) {
    commit('SET_UPDATE_RESPONSE', {})

    try {
      const response = await this.$http.patch(
        `api/v1/user/update/email/${privateID}`,
        {
          email
        }
      )

      commit('SET_UPDATE_RESPONSE', {
        ...response.data,
        ...{ error: false }
      })
    } catch (error) {
      commit('SET_UPDATE_RESPONSE', {
        ...error.response.data,
        ...{ error: false }
      })
    }
  }
}

const mutations = {
  SET_USER (state, payload) {
    state = merge(state, payload)
  },

  SET_UPDATE_RESPONSE (state, payload) {
    state.updateResponse = payload
  },

  SET_REQUIREMENTS (state, payload) {
    state.requirements = payload
  },

  SOCKET_ACTIVITY (state, payload) {
    const index = state.userInfo.activities.findIndex(activity => {
      return activity._id === payload._id
    })

    if (payload.status === 'subscribe') {
      state.userInfo.subscriberCounter++
    }

    if (payload.status === 'unsubscribe') {
      if (index !== -1) {
        Vue.delete(state.userInfo.activities, index)
      }

      const nextCounter = --state.userInfo.subscriberCounter
      // Sollte zwar nie passieren aber just in case damit niemals -1 angezeigt wird
      if (nextCounter <= 0) {
        state.userInfo.subscriberCounter = 0
      } else {
        state.userInfo.subscriberCounter--
      }
      return
    }

    // Wenn der Benutzer schon vorhanden ist updaten wir seinen status
    if (index !== -1) {
      state.userInfo.activities[index].status = payload.status
      // Wenn nicht pushen wir in nach oben
    } else {
      state.userInfo.activities.unshift(payload)
    }
  },

  SOCKET_UPDATE_OWN (state, payload) {
    state.userInfo.status = payload
  },
  SOCKET_ANONYMVISIT (state) {
    state.userInfo.anonymCount++
  }
}

const getters = {
  shouldShowStep2 (state) {
    return (
      state.userInfo.hasOwnProperty('firstName') &&
      !state.userInfo.hasOwnProperty('email')
    )
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
