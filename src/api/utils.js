import store from '@/store'
import { baseURL } from '@/utils/constants'

export function fetchURL (url, opts) {
  // TODO: check validity of token and update if 1 hr less to invalidate
  // TODO: how to solve perms update

  opts = opts || {}
  opts.headers = opts.headers || {}

  let { headers, ...rest } = opts

  return fetch(`${baseURL}${url}`, {
    headers: {
      'Authorization': `Bearer ${store.state.jwt}`,
      ...headers
    },
    ...rest
  })
}

export async function fetchJSON (url, opts) {
  const res = await fetchURL(url, opts)

  if (res.status === 200) {
    return res.json()
  } else {
    throw new Error(res.status)
  }
}

export function removePrefix (url) {
  if (url.startsWith('/files')) {
    url = url.slice(6)
  }

  if (url === '') url = '/'
  if (url[0] !== '/') url = '/' + url
  return url
}

