import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { createProject } from '../../actions/project'

import config from '../../../config/projectWizard'
import Wizard from '../../../components/Wizard'
import SelectProjectType from './SelectProjectType'
import SelectProjectSubType from './SelectProjectSubType'

class ProjectWizard extends Component {

  constructor(props) {
    super(props)

    this.state = {
      creatingProject: false,
      projectName: '',
      projectRef: '',
      projectType: '',
      projectSubType: '',
      wizardStep: 0
    }

    this.createProject = this.createProject.bind(this)
  }

  componentWillUpdate(nextProps) {
    const projectId = _.get(nextProps, 'project.id', null)
    if (!nextProps.processing && !nextProps.error && projectId) {
      // close modal and navigate to project dashboard
      this.props.closeModal()
      this.props.router.push('/projects/' + projectId)
    }
  }

  createProject() {
    this.setState({ creatingProject: true })
    const s = this.state
    this.props.createProject({
      details: {
        devices: [],
        utm: {
          code: s.projectRef
        },
        products: [config[s.projectType].subtypes[s.projectSubType].id]
      },
      description: 'No description provided',
      name: s.projectName,
      type:  config[s.projectType].subtypes[s.projectSubType].id
    })
  }

  render() {
    return (
      <Wizard
        onCancel={() => this.props.closeModal()}
        onStepChange={wizardStep => this.setState({
          // In this wizard we have just two steps, and this callback is triggered
          // only to move from the second step back to the first, thus we always
          // should reset the projectSubType when this callback is fired.
          projectSubType: '',
          wizardStep
        })}
        step={this.state.wizardStep}
      >
        <SelectProjectType
          onProjectNameChange={projectName => this.setState({ projectName })}
          onProjectRefChange={projectRef => this.setState({ projectRef })}
          onProjectTypeChange={projectType => this.setState({
            projectType,
            wizardStep: 1
          })}
          projectName={this.state.projectName}
          projectRef={this.state.projectRef}
          projectType={this.state.projectType}
          projectSubType={this.state.projectSubType}
        />
        <SelectProjectSubType
          creatingProject={this.state.creatingProject}
          createProject={() => this.createProject()}
          onProjectNameChange={projectName => this.setState({ projectName })}
          onProjectRefChange={projectRef => this.setState({ projectRef })}
          onSubCategoryChange={projectSubType => this.setState({ projectSubType })}
          projectName={this.state.projectName}
          projectRef={this.state.projectRef}
          projectType={this.state.projectType}
          projectSubType={this.state.projectSubType}
        />
      </Wizard>
    )
  }
}

ProjectWizard.propTypes = {
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
export default withRouter(connect(mapStateToProps, actionCreators)(ProjectWizard))
