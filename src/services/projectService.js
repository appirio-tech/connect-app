// import _ from 'lodash'
import { fetchJSON } from '../helpers'

class ProjectService {
  constructor() {
    this.token = null
    // this.getProjects = getProjects.bind(this)
  }

  requiresAuth(methodName) {
    if (methodName && methodName.toLowerCase() === 'getprojects') {
      return true
    }
    return false
  }

  setToken(token) {
    this.token = token
  }

  getToken() {
    return this.token
  }

  getProjects(searchTerm) {
    const options = this.getOptions()
    options.method = 'GET' //TODO use constants
    return fetchJSON('http://api.topcoder-dev.com/v4/projects?q=' + searchTerm, options)
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

export default new ProjectService()