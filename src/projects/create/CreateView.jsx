import _ from 'lodash'

import React, { Component, PropTypes } from 'react'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs'
import { ROLE_TOPCODER_MANAGER, ROLE_ADMINISTRATOR } from '../../config/constants'
import WorkProjectForm from './WorkProjectForm'
import AppProjectForm from './AppProjectForm'
import { createProject, clearLoadedProject } from '../../actions/project'

require('./CreateProject.scss')

class CreateView extends Component {

  constructor(props) {
    super(props)
  }

  handleSelect(index, last) {
    console.log('SelectedTab: ' + index, ', LastTab: ' + last)
  }

  createProject(val) {
    debugger
    console.log('creating project', val)
    this.props.createProject(val)
  }

  switchTab(val) {
    this.props.currentTab = val
  }

  renderTabs() {
    return (
      <div className="tabs">
        <ul>
          <li className="active"><a href="#">App Project</a></li>
          <li><a href="#">Work Project</a></li>
        </ul>
      </div>
    )
  }

  render() {
    const childDoms = []
    let tabs = null, form = null
    if (_.indexOf(this.props.userRoles, ROLE_TOPCODER_MANAGER) > -1 ||
        _.indexOf(this.props.userRoles, ROLE_ADMINISTRATOR) > -1 ) {
      tabs = this.renderTabs()
      // Todo select based on Tab
      form = <AppProjectForm submitHandler={this.createProject}/>
    } else {
      form = <WorkProjectForm submitHandler={this.createProject}/>
    }
    return (
      <section className="content">
        <div className="container">
          <a href="#" className="btn-close">x</a>
          {tabs}
          {form}
        </div>
      </section>
    )
  }
}

CreateView.propTypes = {
  userRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentTab: PropTypes.number.isRequired
}

CreateView.defaultProps = {
  userRoles: ['manager'],
  currentTab: 0
}

export default CreateView
