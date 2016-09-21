import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import { Tabs, Tab } from 'appirio-tech-react-components'
import { ROLE_TOPCODER_USER, ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR } from '../../../config/constants'
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
    this.handleSelect = this.handleSelect.bind(this)
  }

  componentWillMount() {
    this.setState({currentTab: 1})
  }

  componentWillUpdate(nextProps) {
    const projectId = _.get(nextProps, 'project.id', null)
    if (!nextProps.processing && !nextProps.error && projectId) {
      // close modal and navigate to project dashboard
      this.props.closeModal()
      this.props.router.push('/projects/' + projectId )
    }
  }

  createProject(val) {
    this.props.createProject(val.newProject)
  }

  handleSelect(index) {
    this.setState({currentTab: index})
  }

  renderWithTabs() {
    const { error, processing } = this.props
    return (
      <Tabs defaultActiveKey={this.state.currentTab} onSelect={this.handleSelect}>
        <Tab eventKey={1} title="App Design & Dev">
          <AppProjectForm processing={processing} error={error} submitHandler={this.createProject} />
        </Tab>
        <Tab eventKey={2} title="Other Work">
          <GenericProjectForm processing={processing} error={error} submitHandler={this.createProject} />
        </Tab>
      </Tabs>
    )
  }

  render() {
    const { error, processing } = this.props
    let content = null

    if (_.indexOf(this.props.userRoles, ROLE_CONNECT_MANAGER) > -1 ||
        _.indexOf(this.props.userRoles, ROLE_TOPCODER_USER) > -1 ||
        _.indexOf(this.props.userRoles, ROLE_ADMINISTRATOR) > -1 ||
        _.indexOf(this.props.userRoles, ROLE_CONNECT_COPILOT) > -1) {
      content = this.renderWithTabs()
    } else {
      content = <AppProjectForm processing={processing} error={error} submitHandler={this.createProject}/>
    }
    return (
      <section className="content">
        <div className="container container-margin">
          {content}
        </div>
      </section>
    )
  }
}

CreateView.propTypes = {
  userRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  closeModal: PropTypes.func.isRequired
}

const mapStateToProps = ({projectState, loadUser }) => ({
  userRoles: loadUser.user.roles,
  processing: projectState.processing,
  error: projectState.error,
  project: projectState.project
})
const actionCreators = { createProject }
export default withRouter(connect(mapStateToProps, actionCreators)(CreateView))
