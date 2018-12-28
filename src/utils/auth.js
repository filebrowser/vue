import store from '@/store'
import router from '@/router'
import { Base64 } from 'js-base64'

function parseToken (token) {
  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new Error('token malformed')
  }

  const data = JSON.parse(Base64.decode(parts[1]))

  if (Math.round(new Date().getTime() / 1000) > data.exp) {
    throw new Error('token expired')
  }

  localStorage.setItem('jwt', token)
  store.commit('setJWT', token)
  store.commit('setUser', data.user)
}

function loggedIn () {
  try {
    if (store.state.jwt) {
      parseToken(store.state.jwt)
    } else if (localStorage.getItem('jwt')) {
      parseToken(localStorage.getItem('jwt'))
    } else {
      return false
    }

    return true
  } catch (_) {
    return false
  }
}

async function login (username, password, recaptcha) {
  const data = { username, password, recaptcha }

  const res = await fetch(`${store.state.baseURL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  const body = await res.text()

  if (res.status === 200) {
    parseToken(body)
  } else {
    throw new Error(body)
  }
}

function logout () {
  store.commit('setJWT', '')
  localStorage.setItem('jwt', null)
  router.push({path: '/login'})
}

export default {
  loggedIn: loggedIn,
  login: login,
  logout: logout
}
