import _ from 'lodash'
import React from 'react'
import SidebarNav from './SidebarNav'

const calcProgress = (project, subSection) => {
  if (subSection.id === 'questions') {
    const fields = _.map(subSection.questions, 'fieldName')
    const vals = _.map(fields, (f) => !_.isEmpty(_.get(project, f)))
    let count = 0
    _.forEach(vals, (v) => {if (v) count++ })
    return [count, subSection.questions.length]
  }
  return []
}
/**
 * Retrieve nav items based on project type
 */
const getNavItems = (project, sections) => {
  return _.map(sections, s => {
    return {
      name: s.title,
      required: s.required,
      link: s.id,
      subItems: _.map(s.subSections, sub => {
        return {
          name: _.isString(sub.title) ? sub.title : _.capitalize(sub.id),
          required: sub.required,
          link: `${s.id}-${sub.id}`,
          progress: calcProgress(project, sub)
        }
      })
    }
  })
}

const ProjectSpecSidebar = ({project, sections}) => {
  const navItems = getNavItems(project, sections)
  return (
    <div className="left-area-panel">
      <h4 className="titles gray-font">Specifications</h4>
      <div className="list-group">
        <SidebarNav items={navItems} />
      </div>
      <div className="sidebar-section-separator"></div>
      <div className="project-spec-actions">
        <div className="project-spec-action">
          <div className="text">In order to submit your project please fill in
          all the required information. Once you do that
          we&quot;ll be able to give you a good estimate.
          </div>
          <button type="button" disabled href="javascript:" className="tc-btn tc-btn-primary tc-btn-sm">
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectSpecSidebar
