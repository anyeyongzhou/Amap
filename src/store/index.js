import { createStore } from 'vuex'

//搜索框
const searchInput = {
  userInput: '',
  inputId: ''
}

//热力图
let thermalMapIsChecked = false

export default createStore({
  state: {
    searchInput,
    thermalMapIsChecked
  },
  getters: {},
  mutations: {
    setSearchInput(state, val) {
      state.searchInput = val
    },
    setThermalMap(state, val) {
      state.thermalMapIsChecked = val
    }
  },
  actions: {},
  modules: {}
})
