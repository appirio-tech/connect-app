import _ from 'lodash'
import React, { PropTypes } from 'react'
import SidebarNav from './SidebarNav'
import { PROJECT_ROLE_OWNER, PROJECT_ROLE_CUSTOMER } from '../../../config/constants'
import './ProjectSpecSidebar.scss'

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

const ProjectSpecSidebar = ({project, sections, currentMemberRole}) => {
  const navItems = getNavItems(project, sections)
  const canSubmitForReview = project.status === 'draft'
    && _.indexOf([PROJECT_ROLE_OWNER, PROJECT_ROLE_CUSTOMER], currentMemberRole) > -1
  return (
    <div className="projectSpecSidebar">
      <h4 className="titles gray-font">Specifications</h4>
      <div className="list-group">
        <SidebarNav items={navItems} />
      </div>
      { canSubmitForReview &&
      <div>
        <div className="text-box">
          <hr />
          <p>In order to submit your project please fill in all the required information. Once that you do that we&quot;ll be able to give you a good estimate.</p>
        </div>
        <div className="btn-boxs">
          <button href="javascript:;" className="btn-gray tc-btn-sm" disabled="disabled">Submit for Review</button>
        </div>
      </div>
      }
    </div>
  )
}

ProjectSpecSidebar.PropTypes = {
  project: PropTypes.object.isRequired,
  sections: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentMemberRole: PropTypes.string
}

export default ProjectSpecSidebar
