/**
 * Project and product templates API service
 *
 * TODO $PROJECT_PLAN$
 *   This is mock for API service, which tough returns **real data** already.
 *   It has to bbe replaced with real API calling when API is ready.
 */
import _ from 'lodash'

import projectTemplates from './templates-json/project-templates.json'

export function getProjectTemplates() {
  return new Promise((resolve) => {
    // simulate loading
    setTimeout(() => {
      resolve(projectTemplates)
    }, 1000)
  })
}

export function getProjectTemplate(projectTemplateId) {
  return Promise.resolve(_.find(projectTemplates, { id: projectTemplateId }))
}
