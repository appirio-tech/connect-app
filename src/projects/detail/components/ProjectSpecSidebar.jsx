import _ from 'lodash'
import React from 'react'
import SidebarNav from './SidebarNav'

// const calcCompleteness = (project, fields) => {
//   let completed = 0
//   const isComplete = field => !_.isEmpty(_.get(project, field, ''))
//   _.forEach(fields, f => {
//     if (isComplete(f))
//       completed += 1
//   })
//   return completed / fields.length * 100
// }

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
          progress: (subSection) => {
            if (subSection.id === 'questions') {
              const fields = _.map(subSection.questions, 'fieldName')
              const vals = _.map(fields, (f) => !_.isEmpty(_.get(project, f)))
              let count = 0
              _.forEach(vals, (v) => {if (v) count++ })
              return [count, subSection.questions.length]
            }
            return []
          }
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
      <div className="btn-boxes">
        <a href="javascript:" className="btn-gray">Submit for Review</a>
      </div>
    </div>
  )
}

export default ProjectSpecSidebar
