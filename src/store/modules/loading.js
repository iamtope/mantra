const state = () => ({
  is: false
})

const actions = {
  start ({ commit }) {
    commit('START_LOADING')
  },

  end ({ commit }) {
    commit('STOP_LOADING')
  },

  stop ({ commit }) {
    commit('STOP_LOADING')
  }
}

const mutations = {
  TOGGLE_LOADING (state, payload) {
    state.is = !payload
  },

  STOP_LOADING (state) {
    state.is = false
  },

  START_LOADING (state) {
    state.is = true
  }
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
