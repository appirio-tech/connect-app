import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import Sticky from 'react-stickynode'
import MediaQuery from 'react-responsive'

import ProjectSpecSidebar from '../components/ProjectSpecSidebar'
import FooterV2 from '../../../components/FooterV2/FooterV2'
import EditProjectForm from '../components/EditProjectForm'
import { SCREEN_BREAKPOINT_MD } from '../../../config/constants'
import { updateProject, fireProjectDirty, fireProjectDirtyUndo } from '../../actions/project'
import spinnerWhileLoading from '../../../components/LoadingSpinner'

import './Scope.scss'

// This handles showing a spinner while the state is being loaded async
const enhance = spinnerWhileLoading(props => !props.processing)
const EnhancedEditProjectForm = enhance(EditProjectForm)

class ScopeContainer extends Component {
  constructor(props) {
    super(props)
    this.saveProject = this.saveProject.bind(this)
    this.state = { project: {} }
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ project: nextProps.project })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      _.isEqual(nextProps.project, this.props.project)
     && _.isEqual(nextState.project, this.state.project)
     && _.isEqual(nextProps.error, this.props.error)
    )
  }
  saveProject(model) {
    // compare old & new
    this.props.updateProject(this.props.project.id, model)
  }

  render() {
    const { project, currentMemberRole, isSuperUser, processing, projectTemplate } = this.props
    const editPriv = isSuperUser ? isSuperUser : !!currentMemberRole
    const sections = projectTemplate.scope.sections

    const leftArea = (
      <div className="scope-left-panel">
        <ProjectSpecSidebar project={project} sections={sections} currentMemberRole={currentMemberRole} />
        <FooterV2 />
      </div>
    )

    return (
      <section className="two-col-content content scopeContainer">
        <div className="container">
          <div className="left-area">
            <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
              {(matches) => {
                if (matches) {
                  return <Sticky top={80}>{leftArea}</Sticky>
                } else {
                  return leftArea
                }
              }}
            </MediaQuery>
          </div>

          <div className="right-area">
            <div className="right-area-content">
              <EnhancedEditProjectForm
                project={project}
                sections={sections}
                isEdittable={editPriv}
                submitHandler={this.saveProject}
                saving={processing}
                route={this.props.route}
                fireProjectDirty={ this.props.fireProjectDirty }
                fireProjectDirtyUndo= { this.props.fireProjectDirtyUndo }
              />
              <div className="right-area-footer">
                { _.get(projectTemplate, 'formDesclaimer') /* TODO $PROJECT_PLAN$ from where formDesclaimer will come? */ }
              </div>
            </div>
          </div>

        </div>
      </section>
    )
  }
}

ScopeContainer.propTypes = {
  project: PropTypes.object.isRequired,
  currentMemberRole: PropTypes.string,
  processing: PropTypes.bool,
  projectTemplate: PropTypes.object.isRequired,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ])
}

const mapStateToProps = ({projectState, loadUser}) => {
  return {
    processing: projectState.processing,
    error: projectState.error,
    currentUserId: parseInt(loadUser.user.id),
    projectTemplate: projectState.projectTemplate,
  }
}

const mapDispatchToProps = { updateProject, fireProjectDirty, fireProjectDirtyUndo }

export default connect(mapStateToProps, mapDispatchToProps)(ScopeContainer)
