'use strict'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import _ from 'lodash'
import update from 'react-addons-update'
import { Icons } from 'appirio-tech-react-components'

import ProjectSpecSidebar from './ProjectSpecSidebar'
import DefineFeature from '../../FeatureSelector/DefineFeature'
import EditProjectForm from './EditProjectForm'
import { updateProject } from '../../actions/project'
import spinnerWhileLoading from '../../../components/LoadingSpinner'

require('./Specification.scss')

const sections = [
  {
    id: 'appDefinition',
    title: 'App Definition',
    required: true,
    description: 'Answer just a few questions about your application. You can also provide the needed information in a supporting-document - upload it below or add a link in the notes section.',
    subSections: [
      {
        id: 'questions',
        required: true,
        title: 'Questions and Specifications',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'feaure-placeholder',
            title: 'What is the goal of your application? How will people use it?',
            description: 'Describe your objectives for creating this application',
            type: 'see-attached-textbox',
            fieldName: 'details.appDefinition.goal'
          },
          {
            icon: 'feature-placeholder',
            title: 'Who are the users of your application? ',
            description: 'Describe the roles and needs of your target users',
            type: 'see-attached-textbox',
            fieldName: 'details.appDefinition.users'
          },
          {
            icon: 'feature-placeholder',
            title: 'Feature requirements',
            description: 'Please list all the features you would like in your application. You can use our wizard to pick from common features or define your own.',
            // type: 'see-attached-features',
            type: 'features',
            fieldName: 'details.features'
          }
        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Notes',
        description: 'Add any other important information regarding your project (e.g., links to documents or existing applications, budget or timeing constraints)',
        type: 'notes'
      },
      {
        id: 'files',
        required: false,
        title: (project) => `Project Files (${_.get(project, 'attachments', []).length})` || 'Files',
        description: '',
        type: 'files',
        fieldName: 'attachments'
      }
    ]
  },
  {
    id: 'designSpecification',
    title: 'Design Specification',
    description: 'Define the visual style for your application or provide a style guide or brand guidelines. Skip this section (or particular questions) if you don\'t have any preferences or restrictions.',
    subSections: [
      {
        id: 'questions',
        required: false,
        title: 'Questions',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'feaure-placeholder',
            title: 'What font style do you prefer? (Pick one)',
            description: 'The typography used in your designs will fit within these broad font styles',
            type: 'tiled-radio-group',
            options: [
              {value: 'serif', title: 'Serif', icon: '', desc: 'formal, old style'},
              {value: 'sanSerif', title: 'Sans Serif', icon: '', desc: 'clean, modern, informal'}
            ],
            fieldName: 'details.designSpecification.fontStyle'
          },
          {
            icon: 'feaure-placeholder',
            title: 'What colors do you like? (Select all that apply)',
            description: 'Your preferred colors will be used to guide the shading in your designs',
            type: 'checkbox-group',
            options: [
              {value: 'blue', label: 'Blue'},
              {value: 'red', label: 'Red'},
              {value: 'green', label: 'Green'},
              {value: 'orange', label: 'Orange'},
              {value: 'black', label: 'Black'}
            ],
            fieldName: 'details.designSpecification.colors'
          },
          {
            icon: 'feaure-placeholder',
            title: 'What icon style do you prefer? (Pick one)',
            description: 'Icons within your designs will follow these styles',
            type: 'tiled-radio-group',
            options: [
              {value: 'flatColor', title: 'Flat Color', icon: '', desc: 'playful'},
              {value: 'thinLine', title: 'Thin Line', icon: '', desc: 'modern'},
              {value: 'solidLine', title: 'Solid Line', icon: '', desc: 'classic'}
            ],
            fieldName: 'details.designSpecification.iconStyle'
          }
        ]
      },
      {
        id: 'notes',
        required: false,
        fieldName: 'details.designSpecification.notes',
        title: 'Notes',
        description: 'Add any other important information regarding your project (e.g., links to documents or existing applications, budget or timeing constraints)',
        type: 'notes'
      }
    ]
  },
  {
    id: 'devSpecification',
    title: 'Development Specification',
    description: 'Define some basic technical requirements for your application or provide any architecture or technical guidelines. Skip this section if you dont know what is required.',
    required: true,
    subSections: [
      {
        id: 'questions',
        required: false,
        title: 'Questions',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'feaure-generic',
            title: 'How should your application be built?',
            description: 'Choose the operating system/platform for your application',
            type: 'checkbox-group',
            options: [
              {value: 'ios', label: 'iOS'},
              {value: 'android', label: 'Android'},
              {value: 'web', label: 'Web'},
              {value: 'hybrid', label: 'Hybrid'}
            ],
            fieldName: 'details.devSpecification.platform'
          },
          {
            icon: 'feaure-generic',
            title: 'Is offline access required for your application?',
            description: 'Do your users need to use the application when they are unable to connect to the internet?',
            type: 'radio-group',
            options: [
              {value: 'true', label: 'Yes'},
              {value: 'false', label: 'No'}
            ],
            fieldName: 'details.devSpecification.offlineAccess'
          },
          {
            icon: 'feaure-generic',
            title: 'What level of security is needed for your application?',
            description: 'Do you expect to be storing or transmitting personal or sensitive information?',
            type: 'radio-group',
            options: [
              {value: 'standard', label: 'Standard - Nothing to do here'},
              {value: 'enhanced', label: 'Enhanced'},
              {value: 'maximumm', label: 'Maximum'}
            ],
            fieldName: 'details.devSpecification.securityLevel'
          }
        ]
      },
      {
        id: 'notes',
        required: false,
        fieldName: 'details.designSpecification.notes',
        title: 'Notes',
        description: 'Add any other important information regarding your project (e.g., links to documents or existing applications, budget or timeing constraints)',
        type: 'notes'
      }
    ]
  }
]


// This handles showing a spinner while the state is being loaded async
const enhance = spinnerWhileLoading(props => !props.processing)
const EnhancedEditProjectForm = enhance(EditProjectForm)

class ProjectSpecification extends Component {
  constructor(props) {
    super(props)
    this.showFeaturesDialog = this.showFeaturesDialog.bind(this)
    this.hideFeaturesDialog = this.hideFeaturesDialog.bind(this)
    this.saveProject = this.saveProject.bind(this)
  }

  componentWillMount() {
    this.setState({
      showFeaturesDialog : false,
      isMember: this.isCurrentUserMember(this.props)
    })
  }

  isCurrentUserMember({currentUserId, project}) {
    return project && !!_.find(project.members, m => m.userId === currentUserId)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({isMember: this.isCurrentUserMember(nextProps)})
  }

  showFeaturesDialog() {
    this.setState(update(this.state, {$merge: { showFeaturesDialog: true } }))
  }

  hideFeaturesDialog() {
    this.setState(update(this.state, {$merge: { showFeaturesDialog: false } }))
  }

  saveProject(model, resetForm, invalidateForm) { // eslint-disable-line no-unused-vars
    this.props.updateProject(this.props.project.id, model)
  }

  render() {
    const { isMember, showFeaturesDialog } = this.state
    const { project } = this.props
    return (
      <section className="two-col-content content">
        <div className="container">
          <Modal
            isOpen={ showFeaturesDialog }
            className="feature-selection-dialog"
            onRequestClose={ this.hideFeaturesDialog }
          >
            <DefineFeature />
            <div onClick={ this.hideFeaturesDialog } className="feature-selection-dialog-close">
              <Icons.XMarkIcon />
            </div>
          </Modal>

          <div className="left-area">
            <ProjectSpecSidebar project={project} sections={sections}/>
          </div>

          <div className="right-area">
            <EnhancedEditProjectForm
              project={project}
              sections={sections}
              isEdittable={isMember}
              submitHandler={this.saveProject}
            />
          </div>

        </div>
      </section>
    )
  }
}

ProjectSpecification.propTypes = {
  project: PropTypes.object.isRequired,
  processing: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ])
}

const mapStateToProps = ({projectState, loadUser}) => {
  return {
    processing: projectState.processing,
    error: projectState.error,
    currentUserId: parseInt(loadUser.user.id)
  }
}

const mapDispatchToProps = { updateProject }

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSpecification)
