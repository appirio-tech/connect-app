import _ from 'lodash'

import React, { Component, PropTypes } from 'react'
import { Tabs, Tab } from 'appirio-tech-react-components'
import { ROLE_MANAGER, ROLE_ADMINISTRATOR } from '../../../config/constants'
import AppProjectForm from './AppProjectForm'
import GenericProjectForm from './GenericProjectForm'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { createProject } from '../../actions/project'

require('./CreateProject.scss')

class CreateView extends Component {

  constructor(props) {
    super(props)
    this.createProject = this.createProject.bind(this)
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.isLoading &&
        nextProps.project.id) {
      this.props.router.push('/projects/' + nextProps.project.id )
    }
  }

  handleSelect(index, last) {
    console.log('SelectedTab: ' + index, ', LastTab: ' + last)
  }

  createProject(val) {
    console.log('creating project', val)
    this.props.createProject(val.newProject)
  }

  switchTab(val) {
    this.props.currentTab = val
  }

  renderWithTabs() {
    return (
      <Tabs defaultActiveKey={1}>
        <Tab eventKey={1} title="App Project">
          <AppProjectForm submitHandler={this.createProject} />
        </Tab>
        <Tab eventKey={2} title="Work Project">
          <GenericProjectForm submitHandler={this.createProject} />
        </Tab>
      </Tabs>
    )
  }

  render() {
    let content = null
    if (_.indexOf(this.props.userRoles, ROLE_MANAGER) > -1 ||
        _.indexOf(this.props.userRoles, ROLE_ADMINISTRATOR) > -1 ) {
      content = this.renderWithTabs()
    } else {
      content = <AppProjectForm submitHandler={this.createProject}/>
    }
    return (
      <section className="content">
        <div className="container">
          <a href="#" className="btn-close"></a>
          {content}
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
  currentTab: 1
}

const mapStateToProps = ({projectState, loadUser }) => ({
  userRoles: loadUser.user.roles,
  isLoading: projectState.isLoading,
  project: projectState.project
})
const actionCreators = { createProject }
export default withRouter(connect(mapStateToProps, actionCreators)(CreateView))
