/**
 * Project and product templates API service
 *
 * TODO $PROJECT_PLAN$
 *   This is mock for API service, which tough returns **real data** already.
 *   It has to bbe replaced with real API calling when API is ready.
 */
import _ from 'lodash'

import projectTemplates from './templates-json/project-templates.json'
import projectTypes from './templates-json/project-types.json'
import productTemplates from './templates-json/product-templates.json'

export function getProjectTemplates() {
  return new Promise((resolve) => {
    // simulate loading
    setTimeout(() => {
      resolve(projectTemplates)
    }, 1000)
  })
}

export function getProjectTemplateByKey(projectTemplateKey) {
  return new Promise((resolve) => {
    // simulate loading
    setTimeout(() => {
      resolve(_.find(projectTemplates, { key: projectTemplateKey }))
    }, 1000)
  })
}

export function getProductTemplate(productId) {
  return new Promise((resolve) => {
    // simulate loading
    setTimeout(() => {
      resolve(_.find(productTemplates, { id: productId }))
    }, 1000)
  })
}

export function getProjectTypes() {
  return new Promise((resolve) => {
    // simulate loading
    setTimeout(() => {
      resolve(projectTypes)
    }, 3000)
  })
}
