import { fetchURL } from './utils'

export async function getAll () {
  const res = await fetchURL(`/api/users`, {})

  if (res.status === 200) {
    return await res.json()
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

export async function create (user) {
  const res = await fetchURL(`/api/users/`, {
    method: 'POST',
    body: JSON.stringify({
      what: 'user',
      which: ['new'],
      data: user
    })
  })

  if (res.status === 201) {
    return res.headers.get('Location')
  } else {
    throw new Error(res.status)
  }

}

export async function update (user, which = ['all']) {
  const res = await fetchURL(`/api/users/${user.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      what: 'user',
      which: which,
      data: user
    })
  })

  if (res.status !== 200) {
    throw new Error(res.status)
  }
}

export async function remove (id) {
  const res = await fetchURL(`/api/users/${id}`, {
    method: 'DELETE'
  })

  if (res.status !== 200) {
    throw new Error(res.status)
  }
}
