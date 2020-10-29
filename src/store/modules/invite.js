const state = () => ({
  inviteLinkUpdateFailed: false
})
const actions = {
  toggleInviteLinkUpdateFailed ({ commit }, payload) {
    commit('SET_INVITELINK_FAIL', payload)
  },

  async updateInviteID ({ commit }, { privateID, newInviteID }) {
    try {
      const response = await this.$http.patch(
        `api/v1/user/update/invite-id/${privateID}`,
        {
          newInviteID
        }
      )
      commit('user/SET_USER', response.data, { root: true })
      commit('SET_INVITELINK_FAIL', false)
    } catch (e) {
      commit('SET_INVITELINK_FAIL', true)
      throw e
    }
  },

  async users ({ commit }, { privateID, emails, inviteID }) {
    await this.$http.post(`api/v1/invite/${privateID}`, {
      emails,
      inviteID
    })
  }
}

const mutations = {
  SET_INVITELINK_FAIL (state, payload) {
    state.inviteLinkUpdateFailed = payload
  }
}

export default {
  namespaced: true,
  actions,
  mutations,
  state
}
