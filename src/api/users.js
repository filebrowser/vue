import { fetchURL } from './utils'

export async function getAll () {
  const res = await fetchURL(`/api/users`, {})

  if (res.status === 200) {
    let data = await res.json()

    console.log(data)
    return data
  } else {
    throw new Error(res.status)
  }
}

export async function get (id) {
  const res = await fetchURL(`/api/users/${id}`, {})

  if (res.status === 200) {
    return res.json()
  } else {
    throw new Error(res.status)
  }
}

/*

export function newUser (user) {
  return new Promise((resolve, reject) => {
    let request = new window.XMLHttpRequest()
    request.open('POST', `${store.state.baseURL}/api/users/`, true)
    if (!store.state.noAuth) request.setRequestHeader('Authorization', `Bearer ${store.state.jwt}`)

    request.onload = () => {
      switch (request.status) {
        case 201:
          resolve(request.getResponseHeader('Location'))
          break
        default:
          reject(request.responseText)
          break
      }
    }
    request.onerror = (error) => reject(error)
    request.send(JSON.stringify({
      what: 'user',
      which: 'new',
      data: user
    }))
  })
}

export function updateUser (user, which) {
  return new Promise((resolve, reject) => {
    let request = new window.XMLHttpRequest()
    request.open('PUT', `${store.state.baseURL}/api/users/${user.ID}`, true)
    if (!store.state.noAuth) request.setRequestHeader('Authorization', `Bearer ${store.state.jwt}`)

    request.onload = () => {
      switch (request.status) {
        case 200:
          resolve(request.getResponseHeader('Location'))
          break
        default:
          reject(request.responseText)
          break
      }
    }
    request.onerror = (error) => reject(error)
    request.send(JSON.stringify({
      what: 'user',
      which: (typeof which === 'string') ? which : 'all',
      data: user
    }))
  })
}

export function deleteUser (id) {
  return new Promise((resolve, reject) => {
    let request = new window.XMLHttpRequest()
    request.open('DELETE', `${store.state.baseURL}/api/users/${id}`, true)
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
    request.onerror = (error) => reject(error)
    request.send()
  })
}

*/