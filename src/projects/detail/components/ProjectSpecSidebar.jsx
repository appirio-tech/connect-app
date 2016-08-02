import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import { SidebarNav } from './SidebarNav'


const DESIGN_SPEC = 'Design Specification'
const DEV_SPEC = 'Development Specification'
const APP_DEFN = 'App Definition'

const calcCompleteness = (project, fields) => {
  let completed = 0
  const isComplete = field => !_.isEmpty(_.get(project, field, ''))
  _.forEach(fields, f => {
    if (isComplete(f))
      completed += 1
  })
  return completed / fields.length * 100
}

class ProjectSpecSidebar extends Component {

  getSubNavItems(section, project) {
    switch(section) {
    case APP_DEFN:
      return [{
        name: 'Features',
        link: '#',
        percentage: calcCompleteness(project, ['details.features'])
      }, {
        name: 'Questions and Specification',
        link: '#',
        percentage: calcCompleteness(project, ['details.design.features'])
      }, {
        name: 'Notes',
        link: '#',
        percentage: calcCompleteness(project, ['details.design.notes'])
      }]
    case DESIGN_SPEC:
      return [{
        name: 'Features',
        link: 'design-spec-features',
        percentage: calcCompleteness(project, ['details.design.features'])
      }, {
        name: 'Questions and Specification',
        link: '#',
        percentage: calcCompleteness(project, ['details.design.features'])
      }, {
        name: 'Notes',
        link: '',
        percentage: calcCompleteness(project, ['details.design.notes'])
      }]
    case DEV_SPEC:
      return [{
        name: 'Features',
        link: '',
        percentage: calcCompleteness(project, ['details.design.features'])
      }, {
        name: 'Questions and Specification',
        link: '#',
        percentage: calcCompleteness(project, ['details.design.features'])
      }, {
        name: 'Notes',
        link: '#',
        percentage: calcCompleteness(project, ['details.design.notes'])
      }]
    }
    return []
  }

  getNavItems(project) {
    let navItems = []
    if (_.indexOf(['app_dev', 'visual_prototype', 'visual_design'], project.type) > -1) {
      navItems = [{
        name: APP_DEFN,
        link: 'raw-json',
        subItems: this.getSubNavItems(APP_DEFN, project)
      }, {
        name: DESIGN_SPEC,
        link: 'design-spec',
        subItems: this.getSubNavItems(DESIGN_SPEC, project)
      }]
    }
    if (_.indexOf(['app_dev'], project.type) > -1) {
      navItems.push({
        name: DEV_SPEC,
        link: '',
        subItems: this.getSubNavItems(DEV_SPEC, project)
      })
    }
    return navItems
  }

  render() {
    const navItems = this.getNavItems(this.props.project)
    return (
      <div className="left-area-panel">
        <h4 className="titles gray-font">Specifications</h4>
        <div className="list-group">
          <SidebarNav items={navItems} />
        </div>
        <div className="btn-boxes">
            <a href="javascript:;" className="btn-gray">Submit for Review</a>
        </div>
      </div>
    )
  }
}

ProjectSpecSidebar.PropTypes = {
  project: PropTypes.object.isRequired
}

export default ProjectSpecSidebar
