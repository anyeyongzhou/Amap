import { createStore } from 'vuex'

//搜索框
const searchInput = {
  userInput: '',
  inputId: ''
}

//热力图
let thermalMapIsChecked = false

//
let mouseGetMessage = {
  address: '',
  lngLat: null
}

export default createStore({
  state: {
    searchInput,
    thermalMapIsChecked,
    mouseGetMessage
  },
  getters: {},
  mutations: {
    setSearchInput(state, val) {
      state.searchInput = val
    },
    setThermalMap(state, val) {
      state.thermalMapIsChecked = val
    },
    setMouseGetMessage(state, val) {
      state.mouseGetMessage = val
    }
  },
  actions: {},
  modules: {}
})
