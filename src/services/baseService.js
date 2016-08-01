class BaseService {
  constructor() {
    this.token = null
  }

  setToken(token) {
    this.token = token
  }

  getToken() {
    return this.token
  }

  getOptions(requiresAuth) {
    const options = {}
    const myHeaders = new Headers()
    if (requiresAuth) {
      myHeaders.append('Authorization', 'Basic ' + this.token) //TODO use constants
    }
    options.headers = myHeaders
    return options
  }
}

export default BaseService
