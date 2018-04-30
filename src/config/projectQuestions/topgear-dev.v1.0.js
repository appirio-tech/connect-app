import React from 'react' // eslint-disable-line no-unused-vars
import IconTechOutlineMobile from  '../../assets/icons/icon-tech-outline-mobile.svg'
import IconTechOutlineTablet from  '../../assets/icons/icon-tech-outline-tablet.svg'
import IconTechOutlineDesktop from  '../../assets/icons/icon-tech-outline-desktop.svg'
import IconTechOutlineWatchApple from  '../../assets/icons/icon-tech-outline-watch-apple.svg'
import IconTcSpecTypeSerif from  '../../assets/icons/icon-tc-spec-type-serif.svg'
import IconTcSpecTypeSansSerif from  '../../assets/icons/icon-tc-spec-type-sans-serif.svg'
import IconTcSpecIconTypeColorHome from  '../../assets/icons/icon-tc-spec-icon-type-color-home.svg'
import IconTcSpecIconTypeOutlineHome from  '../../assets/icons/icon-tc-spec-icon-type-outline-home.svg'
import IconTcSpecIconTypeGlyphHome from  '../../assets/icons/icon-tc-spec-icon-type-glyph-home.svg'
import { isFileRequired, findTitle, findFilesSectionTitle } from '../projectWizard'

const sections = [
  {
    id: 'appDefinition',
    title: findTitle,
    required: true,
    description: 'Please answer a few basic questions about your project. You can also provide the needed information in a supporting document--add a link in the notes section or upload it below.',
    subSections: [
      {
        id: 'projectName',
        required: true,
        validationError: 'Please provide a name for your project',
        fieldName: 'name',
        description: '',
        title: 'Project Name',
        type: 'project-name'
      },
      {
        id: 'questions',
        required: true,
        hideTitle: true,
        title: 'Questions',
        description: '',
        type: 'questions',
        questions: [
          {
            id: 'projectInfo',
            // required is not needed if we specifiy validations
            // required: true,
            validations: 'isRequired,minLength:160',
            validationErrors: {
              isRequired : 'Please provide a description',
              minLength  : 'Please enter at least 160 characters'
            },
            fieldName: 'description',
            description: 'Brief Description',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'DU',
            description: '',
            type: 'textbox',
            fieldName: 'details.appDefinition.goal.du'
          },
          {
            icon: 'question',
            title: 'Project Code',
            type: 'textbox',
            fieldName: 'details.appDefinition.users.projectCode'
          },
          {
            icon: 'question',
            title: 'Cost Center code',
            type: 'textbox',
            fieldName: 'details.appDefinition.users.cost_center'
          },
          {
            icon: 'question',
            title: 'Part of NG3',
            type: 'textbox',
            fieldName: 'details.appDefinition.users.ng3'
          }
        ]
      }
    ]
  }
]

export default sections

export const basicSections = [
  {
    id: 'appDefinition',
    title: '',
    required: true,
    description: 'Please answer a few basic questions about your project and, as an option, add links to supporting documents in the “Notes” section. If you have any files to upload, you’ll be able to do so later.',
    subSections: [
      {
        id: 'projectName',
        required: true,
        validationError: 'Please provide a name for your project',
        fieldName: 'name',
        description: '',
        title: 'Project Name',
        type: 'project-name'
      },
      {
        id: 'questions',
        required: true,
        hideTitle: true,
        title: 'Questions',
        description: '',
        type: 'questions',
        questions: [
          {
            id: 'projectInfo',
            // required is not needed if we specifiy validations
            // required: true,
            validations: 'isRequired,minLength:160',
            validationErrors: {
              isRequired : 'Please provide a description',
              minLength  : 'Please enter at least 160 characters'
            },
            fieldName: 'description',
            description: 'Brief Description',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'DU',
            description: '',
            type: 'textbox',
            fieldName: 'details.appDefinition.goal.du'
          },
          {
            icon: 'question',
            title: 'Project Code',
            type: 'textbox',
            fieldName: 'details.appDefinition.users.projectCode'
          },
          {
            icon: 'question',
            title: 'Cost Center code',
            type: 'textbox',
            fieldName: 'details.appDefinition.users.cost_center'
          },
          {
            icon: 'question',
            title: 'Part of NG3',
            type: 'textbox',
            fieldName: 'details.appDefinition.users.ng3'
          }

        ]
      }
    ]
  }
]
