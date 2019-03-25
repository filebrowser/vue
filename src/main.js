import { sync } from 'vuex-router-sync'
import store from '@/store'
import router from '@/router'
import i18n from '@/i18n'
import Vue from '@/utils/vue'
import { recaptcha, loginPage } from '@/utils/constants'
import { login, loginToken, validateLogin } from '@/utils/auth'
import App from '@/App'

sync(store, router)

async function start () {
  let params = (new URL(document.location)).searchParams
  let token = params.get("token")
  let username = params.get("username")
 
  if (loginPage) {
    await validateLogin()
  } else if (token != null) {
    await loginToken(username, token)
  } else {
    await login('', '', '')
  }

  if (recaptcha) {
    await new Promise (resolve => {
      const check = () => {
        if (typeof window.grecaptcha === 'undefined') {
          setTimeout(check, 100)
        } else {
          resolve()
        }
      }

      check()
    })
  }

  new Vue({
    el: '#app',
    store,
    router,
    i18n,
    template: '<App/>',
    components: { App }
  })
}

start()
