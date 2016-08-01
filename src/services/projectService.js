import BaseService from './baseService'
import { fetchJSON } from '../helpers'

class ProjectService extends BaseService {
  constructor() {
    super()
    this.getProjects = this.getProjects.bind(this)
    this.getOptions = this.getOptions.bind(this)
  }

  requiresAuth(methodName) {
    if (methodName && methodName.toLowerCase() === 'getprojects') {
      return true
    }
    return false
  }

  getProjects(searchTerm) {
    console.log(searchTerm)
    const options = this.getOptions(true)
    options.method = 'GET' //TODO use constants
    return fetchJSON('https://api.topcoder-dev.com/v3/challenges/', options)
  }
}

export default new ProjectService()
