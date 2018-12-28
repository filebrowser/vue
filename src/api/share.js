import { fetchURL, removePrefix } from './utils'

export async function get (url) {
  url = removePrefix(url)

  const res = await fetchURL(`/api/share${url}`)

  if (res.status === 200) {
    return res.json()
  } else {
    throw new Error(res.status)
  }
}

export async function remove (hash) {
  const res = await fetchURL(`/api/share/${hash}`, {
    method: 'DELETE'
  })

  if (res.status !== 200) {
    throw new Error(res.status)
  }
}

export async function create (url, expires = '', unit = 'hours') {
  url = removePrefix(url)
  url = `/api/share${url}`
  if (expires !== '') {
    url += `?expires=${expires}&unit=${unit}`
  }

  const res = await fetchURL(url, {
    method: 'POST'
  })

  if (res.status === 200) {
    return res.json()
  } else {
    throw new Error(res.status)
  }
}
