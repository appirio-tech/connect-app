import Auth0Client from '@auth0/auth0-spa-js'
import { initialState } from '../reducers/searchTerm'

let auth0 = null
const tc_cookie = 'tc-rs256'

const initAuth0 = async () => {
  if (!auth0) {
    console.log('initialing auth0...')
    return Auth0Client({
      domain: 'testsachin.topcoder-dev.com',
      client_id: 'Is6DB1N9VBbygNfh1UhDJM8SVC3SHtHm',
      redirect_uri: window.location.protocol + "//" + window.location.host
    })
  } else {
    return new Promise((resolve, reject) => { resolve(auth0) })
  }
}

window.addEventListener('load', async () => {
  try {
    const query = window.location.search;
    const shouldParseResult = query.includes("code=") && query.includes("state=");
    if (shouldParseResult) {
      const redirectResult = await auth0.handleRedirectCallback();
      //logged in. you can get the user profile like this:
      const user = await auth0.getUser();
      console.log("userrrrr", auth0)
      storeToken(auth0)
    }
    if (auth0) {
      let user = await auth0.getUser()
      if (user) {
        storeToken(auth0)
      }
    }
  } catch (e) { console.log("Error", e, auth0) }
})

function setCookie(cname, cvalue, exmins) {
  let d = new Date();
  d.setTime(d.getTime() + (exmins * 60 * 1000));
  let expires = ";expires=" + d.toUTCString();
  let domain = ""
  if (location.hostname !== 'localhost') {
    domain = ";domain=." + location.hostname.split('.').reverse()[1] + "." + location.hostname.split('.').reverse()[0]
  }
  document.cookie = cname + "=" + cvalue + domain + expires + ";path=/";
}

export function decodeToken(token) {
  const parts = token.split('.')

  if (parts.length !== 3) {
    throw new Error('The token is invalid')
  }

  const decoded = urlBase64Decode(parts[1])

  if (!decoded) {
    throw new Error('Cannot decode the token')
  }

  // covert base64 token in JSON object
  let t = JSON.parse(decoded)

  // tweaking for custom claim for RS256
  t.userId = _.parseInt(_.find(t, (value, key) => {
    return (key.indexOf('userId') !== -1)
  }))
  t.handle = _.find(t, (value, key) => {
    return (key.indexOf('handle') !== -1)
  })
  t.roles = _.find(t, (value, key) => {
    return (key.indexOf('roles') !== -1)
  })

  return t
}

export function isTokenExpired(token, offsetSeconds = 0) {
  const d = getTokenExpirationDate(token)

  if (d === null) {
    return false
  }

  // Token expired?
  return !(d.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)))
}

function getTokenExpirationDate(token) {
  const decoded = decodeToken(token)

  if (typeof decoded.exp === 'undefined') {
    return null
  }

  const d = new Date(0) // The 0 here is the key, which sets the date to the epoch
  d.setUTCSeconds(decoded.exp)

  return d
}

function urlBase64Decode(str) {
  let output = str.replace(/-/g, '+').replace(/_/g, '/')

  switch (output.length % 4) {
    case 0:
      break

    case 2:
      output += '=='
      break

    case 3:
      output += '='
      break

    default:
      throw 'Illegal base64url string!'
  }
  return decodeURIComponent(escape(atob(output))) //polyfill https://github.com/davidchambers/Base64.js
}

function getCookie(name) {
  const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)')
  return v ? v[2] : undefined
}

const storeToken = async (auth0) => {
  if (auth0) {
    let rawIdToken = await auth0.getIdTokenClaims()
    let token = rawIdToken['__raw']
    console.log("setting token in cookie")
    setCookie(tc_cookie, token, 30)
  }
}

export const getFreshToken = async () => {
  let token = null
  const rs256Token = getCookie(tc_cookie)
  if (rs256Token && !isTokenExpired(rs256Token)) {
    token = rs256Token
    console.log("fetched token from cookie.")
  } else {
    console.log("fresh token request")
    token = login()
  }
  return new Promise((resolve, reject) => {
    resolve(token)
  })

}

export const login = async () => {
  let token = null
  await initAuth0().then(async (auth) => {
    auth0 = auth
    await auth.loginWithRedirect()
    storeToken(auth0)
  }).catch((e) => { console.log("Error in auth0 login", e) })
  console.log("Token is", token)
  return token
}
