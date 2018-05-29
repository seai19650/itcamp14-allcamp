const state = {
  user: undefined
}
const mutations = {
  SET_USER (state, payload) {
    state.user = payload
  },
  CLEAR_USER (state) {
    state.user = undefined
  }
}
const actions = {
  setUser: ({
    commit
  }, user) => commit('SET_USER', user),
  clearUser: ({
    commit
  }, user) => commit('CLEAR_USER')
}
const getters = {
  getUser: state => state.user
}
export default {
  state,
  getters,
  mutations,
  actions
}
