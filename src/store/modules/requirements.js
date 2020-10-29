const state = () => ({
  all: []
})

const actions = {
  async fetch ({ commit }, lang = 'de') {
    const response = await this.$http.get(`/json/requirements.${lang}.json`)
    commit('SET_ALL', response.data)
  }
}

const mutations = {
  SET_ALL (state, payload) {
    state.all = payload
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
