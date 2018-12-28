import store from '@/store'

const ssl = (window.location.protocol === 'https:')

export function command (url, command, onmessage, onclose) {
  let protocol = (ssl ? 'wss:' : 'ws:')
  url = removePrefix(url)
  url = `${protocol}//${window.location.host}${store.state.baseURL}/api/command${url}`

  let conn = new window.WebSocket(url)
  conn.onopen = () => conn.send(command)
  conn.onmessage = onmessage
  conn.onclose = onclose
}

export function search (url, search, onmessage, onclose) {
  let protocol = (ssl ? 'wss:' : 'ws:')
  url = removePrefix(url)
  url = `${protocol}//${window.location.host}${store.state.baseURL}/api/search${url}`

  let conn = new window.WebSocket(url)
  conn.onopen = () => conn.send(search)
  conn.onmessage = onmessage
  conn.onclose = onclose
}


export function getSettings () {
  return new Promise((resolve, reject) => {
    let request = new window.XMLHttpRequest()
    request.open('GET', `${store.state.baseURL}/api/settings/`, true)
    if (!store.state.noAuth) request.setRequestHeader('Authorization', `Bearer ${store.state.jwt}`)

    request.onload = () => {
      switch (request.status) {
        case 200:
          resolve(JSON.parse(request.responseText))
          break
        default:
          reject(request.responseText)
          break
      }
    }
    request.onerror = (error) => reject(error)
    request.send()
  })
}

export function updateSettings (param, which) {
  return new Promise((resolve, reject) => {
    let data = {
      what: 'settings',
      which: which,
      data: {}
    }

    data.data[which] = param

    let request = new window.XMLHttpRequest()
    request.open('PUT', `${store.state.baseURL}/api/settings/`, true)
    if (!store.state.noAuth) request.setRequestHeader('Authorization', `Bearer ${store.state.jwt}`)

    request.onload = () => {
      switch (request.status) {
        case 200:
          resolve()
          break
        default:
          reject(request.responseText)
          break
      }
    }
    request.onerror = (error) => { reject(error) }
    request.send(JSON.stringify(data))
  })
}

// USERS