'use strict'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import _ from 'lodash'
import update from 'react-addons-update'
import { XMarkIcon } from 'appirio-tech-react-components'

import ProjectSpecSidebar from './ProjectSpecSidebar'
import DefineFeature from '../../FeatureSelector/DefineFeature'
import EditProjectForm from './EditProjectForm'

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
            field: 'details.features'
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
            type: 'radio-group',
            options: [
              {value: 'serif', label: 'Serif'},
              {value: 'sanSerif', label: 'Sans Serif'}
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
            title: 'What icon style do you prefer',
            description: 'Icons within your designs will follow these styles',
            type: 'radio-group',
            options: [
              {value: 'flatColor', label: 'Flat Color'},
              {value: 'thinLine', label: 'Thin Line'},
              {value: 'solidLine', label: 'Solid Line'}
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
              {value: true, label: 'Yes'},
              {value: false, label: 'No'}
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

class ProjectSpecification extends Component {
  constructor(props) {
    super(props)
    this.showFeaturesDialog = this.showFeaturesDialog.bind(this)
    this.hideFeaturesDialog = this.hideFeaturesDialog.bind(this)
  }

  componentWillMount() {
    this.setState({ showFeaturesDialog : false})
  }

  showFeaturesDialog() {
    this.setState(update(this.state, {$merge: { showFeaturesDialog: true } }))
  }

  hideFeaturesDialog() {
    this.setState(update(this.state, {$merge: { showFeaturesDialog: false } }))
  }

  render() {
    return (
      <section className="two-col-content content">
        <div className="container">
          <Modal
            isOpen={ this.state.showFeaturesDialog }
            className="feature-selection-dialog"
            onRequestClose={ this.hideFeaturesDialog }
          >
            <DefineFeature />
            <div onClick={ this.hideFeaturesDialog } className="feature-selection-dialog-close">
              <XMarkIcon />
            </div>
          </Modal>

          <div className="left-area">
            <ProjectSpecSidebar project={this.props.project} sections={sections}/>
          </div>

          <div className="right-area">
            <EditProjectForm project={this.props.project} sections={sections} />
          </div>

        </div>
      </section>
    )
  }
}

ProjectSpecification.propTypes = {
  project: PropTypes.object.isRequired,
  members: PropTypes.object.isRequired
}
const mapStateToProps = ({members}) => {
  return {
    members: members.members
  }
}

export default connect(mapStateToProps)(ProjectSpecification)
