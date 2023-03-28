import { createStore } from 'vuex'

const searchInput = {
  userInput: '',
  inputId: ''
}

export default createStore({
  state: {
    searchInput
  },
  getters: {},
  mutations: {
    setSearchInput(state, val) {
      state.searchInput = val
    }
  },
  actions: {},
  modules: {}
})
