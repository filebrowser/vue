import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import i18n from './i18n'
import Noty from 'noty'
import { sync } from 'vuex-router-sync'
import { disableExternal } from '@/utils/constants'

Vue.config.productionTip = true

const notyDefault = {
  type: 'info',
  layout: 'bottomRight',
  timeout: 1000,
  progressBar: true
}

Vue.prototype.$noty = function (opts) {
  new Noty(Object.assign({}, notyDefault, opts)).show()
}

Vue.prototype.$showSuccess = function (message) {
  new Noty(Object.assign({}, notyDefault, {
    text: message,
    type: 'success'
  })).show()
}

Vue.prototype.$showError = function (error) {
  let btns = [
    Noty.button(i18n.t('buttons.close'), '', function () {
      n.close()
    })
  ]

  if (!disableExternal) {
    btns.unshift(Noty.button(i18n.t('buttons.reportIssue'), '', function () {
      window.open('https://github.com/filebrowser/filebrowser/issues/new/choose')
    }))
  }

  let n = new Noty(Object.assign({}, notyDefault, {
    text: error.message || error,
    type: 'error',
    timeout: null,
    buttons: btns
  }))

  n.show()
}

Vue.directive('focus', {
  inserted: function (el) {
    el.focus()
  }
})

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  i18n,
  template: '<App/>',
  components: { App }
})
