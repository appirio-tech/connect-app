import axios from 'axios'
import store from '../config/store'
import { getFreshToken, isTokenExpired } from 'tc-accounts'

const getToken = () => {
  return new Promise((resolve) => {
    const userState = store.getState().loadUser
    const token = userState && userState.user ? userState.user.token : null
    if (token && !isTokenExpired(token)) {
      return resolve(token)
    } else {
      return getFreshToken()
        .then((token) => {
          resolve(token)
        })
    }
  })
}

export const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 20000  // 5 seconds
})

// request interceptor to pass auth token
axiosInstance.interceptors.request.use( config => {

  return getToken()
    .then(token => {
      config.headers['Authorization'] = `Bearer ${token}`
      return config
    })
    .catch(err => {
      // TODO handle this error somehow
      console.log(err)
      return config
    })
})
