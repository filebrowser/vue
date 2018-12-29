import store from '@/store'
import { baseURL } from '@/utils/constants'

export function fetchURL (url, opts) {
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

export function removePrefix (url) {
  if (url.startsWith('/files')) {
    url = url.slice(6)
  }

  if (url === '') url = '/'
  if (url[0] !== '/') url = '/' + url
  return url
}

