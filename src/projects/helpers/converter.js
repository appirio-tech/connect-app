/**
 * Helper methods to convert data between project versions formats
 */
import _ from 'lodash'
import moment from 'moment'

/**
 * Gets the list of phases from the old project format V2
 *
 * @param {Object} project         project
 * @param {Object} directProject   direct project
 * @param {Object} projectTemplate project template
 *
 * @return {Array} list of phases
 */
export function getPhasesWithProductsFromProjectV2(project, directProject, projectTemplate) {
  const actualDuration = _.get(directProject, 'actualDuration', 0)
  const projectedDuration = _.get(directProject, 'projectedDuration', 0)
  const billingAccountId = _.get(directProject, 'billingAccountIds[0]', null)
  const projectCost = _.get(directProject, 'projectCost', 0)
  const actualCost = _.get(directProject, 'actualCost', 0)

  const progressPercent = projectedDuration !== 0 ? actualDuration / projectedDuration : 0

  const startDate = directProject.project.creationDate || project.createdAt || null
  const endDate = projectedDuration !== 0 && startDate ? moment(startDate).add(projectedDuration, 'days').format() : null

  return Promise.resolve([{
    id: 0,
    name: projectTemplate.name,
    status: project.status,
    projectId: project.id,
    startDate,
    endDate,
    budget: projectCost,
    progress: progressPercent,
    details: {},

    // NOTE so far one phase always has 1 product
    // but as in the future this may be changed, we keep products as an array
    products: [{
      id: 0,
      phaseId: 0,
      projectId: project.id,
      directProjectId: project.directProjectId,
      billingAccountId,
      name: projectTemplate.name,
      templateId: _.get(projectTemplate, 'phases[0].productTemplateId', null),
      type: projectTemplate.key, // project template key is same with productKey for old projects
      estimatedPrice: projectCost,
      actualPrice: actualCost,
      details: project.details,
    }]
  }])
}
