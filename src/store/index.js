import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

const state = {
  user: {},
  req: {},
  oldReq: {},
  clipboard: {
    key: '',
    items: []
  },
  recaptcha: '',
  // TODO:
  baseURL: document.querySelector('meta[name="base"]').getAttribute('content'),
  signup: document.querySelector('meta[name="signup"]').getAttribute('content') === 'true',
  version: '2',
  jwt: '',
  progress: 0,
  loading: false,
  reload: false,
  selected: [],
  multiple: false,
  show: null,
  showMessage: null,
  showConfirm: null
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  mutations
})
