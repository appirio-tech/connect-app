import _ from 'lodash'


const _projects = require('./test/projects.json')

export function getProjects(criteria, sort, limit, offset) {
  // TODO
  console.log(criteria, sort, limit, offset)
}

/**
 * Get a project basd on it's id
 * @param  {integer} projectId unique identifier of the project
 * @return {[type]}           [description]
 */
export function getProjectById(projectId) {
  projectId = parseInt(projectId)
  return Promise.resolve(_projects)
    .then((projects) => {
      return _.find(projects, (p) => { return p.id === projectId })
    })
}

export function updateProject(projectId, updatedProps) {
  const p = _.find(_projects, (p) => { return p.id === projectId })
  if (!p)
    return Promise.reject('Project not found')

  _.assign(p, updatedProps)
  return Promise.resolve(p)

}


export function createProject(projectProps) {
  const newId = _.max(_.map(_projects, 'id')) + 1
  const newProject = _.assign({}, projectProps, {id: newId})
  _projects.push(newProject)
  return Promise.resolve(newProject)
}
