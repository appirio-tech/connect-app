/**
 * Helpers related to project and product templates
 */
import _ from 'lodash'

/**
 * Finds field from the project creation template
 *
 * @param {Array}  projectTemplate    project template where search is to be made
 * @param {String} sectionId          id of the section in the project template
 * @param {String} subSectionId       id of the sub section under the section identified by sectionId
 * @param {String} fieldName          name of the field to be fetched
 *
 * @return {Object} field from the template, if found, null otherwise
 */
export function getProjectCreationTemplateField(
  projectTemplate,
  sectionId,
  subSectionId,
  fieldName
) {
  const section = _.find(projectTemplate.scope, { id: sectionId })
  let subSection = null
  if (subSectionId && section) {
    subSection = _.find(section.subSections, {id : subSectionId })
  }
  if (subSection) {
    if (subSectionId === 'questions') {
      return _.find(subSection.questions, { fieldName })
    }
    return subSection.fieldName === fieldName ? subSection : null
  }
  return null
}

/**
 * Finds project template by its alias
 *
 * NOTE: search only by the first alias
 *
 * @param {Array}  projectTemplates list of project templates
 * @param {String} alias            project template alias to search by
 *
 * @return {Object} project template or null
 */
export function getProjectTemplateByAlias(projectTemplates, alias) {
  return _.find(projectTemplates, (projectTemplate) =>
    projectTemplate.aliases[0] === alias
  ) || null
}

/**
 * Finds project template by its key
 *
 * @param {Array}  projectTemplates   list of project templates
 * @param {String} projectTemplateKey project template key to search by
 *
 * @return {Object} project template or null
 */
export function getProjectTemplateByKey(projectTemplates, projectTemplateKey) {
  return _.find(projectTemplates, { key: projectTemplateKey }) || null
}

/**
 * Finds product template by its key
 *
 * @param {Array}  productTemplates   list of product templates
 * @param {String} productTemplateKey product template key to search by
 *
 * @return {Object} project template or null
 */
export function getProductTemplateByKey(productTemplates, productTemplateKey) {
  return _.find(productTemplates, { productKey: productTemplateKey }) || null
}

/**
 * Get project templates by category
 *
 * @param {Array}   projectTemplates list of project templates
 * @param {String}  categoryKey      category key
 * @param {Boolean} visibleOnly      if true only not hidden and not disabled project templates will returned
 *
 * @returns {Array} list of project templates
 */
export function getProjectTemplatesByCategory(projectTemplates, categoryKey, visibleOnly) {
  return _.filter(projectTemplates, { category: categoryKey })
    .filter((projectTemplate) => visibleOnly ? !projectTemplate.hidden && !projectTemplate.disabled : true)
}

/**
 * Get project type by its key
 *
 * @param {Array}  projectTypes   list of project types
 * @param {String} projectTypeKey project type key
 *
 * @returns {Object} project type
 */
export function getProjectTypeByKey(projectTypes, projectTypeKey) {
  return _.find(projectTypes, { key: projectTypeKey })
}

/**
 * Finds project type by its alias
 *
 * NOTE: search only by the first alias
 *
 * @param {Array}  projectTypes list of project types
 * @param {String} alias        project type alias to search by
 *
 * @return {Object} project type or null
 */
export function getProjectTypeByAlias(projectTypes, alias) {
  return _.find(projectTypes, (projectType) =>
    projectType.aliases[0] === alias
  ) || null
}
