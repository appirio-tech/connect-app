import React from 'react'
import _ from 'lodash'
import { Icons } from 'appirio-tech-react-components'
import NumberText from '../../components/NumberText/NumberText'
import { findProduct} from '../projectWizard'

const isFileRequired = (project, subSections) => {
  const subSection = _.find(subSections, (s) => s.type === 'questions')
  const fields = _.filter(subSection.questions, q => q.type.indexOf('see-attached') > -1)
  // iterate over all seeAttached type fields to check
  //  if any see attached is checked.
  return _.some(_.map(
    _.map(fields, 'fieldName'),
    fn => _.get(project, `${fn}.seeAttached`)
  ))
}

const sections = [
  {
    id: 'appDefinition',
    title: function(project, showProduct) {
      const product = _.get(project, 'details.products[0]')
      if (showProduct && product) {
        const prd = findProduct(product)
        if (prd) return prd
      }
      return 'Definition'
    },
    productName: 'Wireframes',
    required: true,
    description: 'Answer just a few questions about your application. You can also provide the needed information in a supporting-document - upload it below or add a link in the notes section.',
    subSections: [
      {
        id: 'projectName',
        required: true,
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
            icon: 'question',
            title: 'How many screens do you need designed?',
            description: 'This is the most popular project size that can get a medium-sized app designed in a breeze',
            fieldName: 'details.appDefinition.numberScreens',
            type: 'tiled-radio-group',
            options: [
              {value: '10', title: 'screens', icon: NumberText, iconOptions: { number: '10' }, desc: '7-10 days', price: 5000},
              {value: '15', title: 'screens', icon: NumberText, iconOptions: { number: '15' }, desc: '10-12 days', price: 7000}
            ]
          },
          {
            icon: 'question',
            title: 'Which is your primary device target?',
            description: 'Select only the device that you need to develop for. \
                          In most cases limiting the scope of your project would result \
                          in better final result. Topcoder recommends to always start \
                          with the mobile phone view and expand to other devices as your \
                          app matures.',
            fieldName: 'details.appDefinition.primaryTarget',
            type: 'tiled-radio-group',
            options: [
              {value: 'Phone', title: 'Phone', icon: Icons.IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'Tablet', title: 'Tablet', icon: Icons.IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'Desktop', title: 'Desktop', icon: Icons.IconTechOutlineDesktop, iconOptions: { fill: '#00000'}, desc: 'all OS'},
              {value: 'Wearable', title: 'Wearable', icon: Icons.IconTechOutlineWatchApple, iconOptions: { fill: '#00000'}, desc: 'Watch OS, Android Wear'}
            ]
          },
          {
            icon: 'question',
            id: 'projectInfo',
            fieldName: 'description',
            description: 'Brief Description',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'What is the goal of your application? How will people use it?',
            description: 'Describe your objectives for creating this application',
            type: 'see-attached-textbox',
            fieldName: 'details.appDefinition.goal'
          },
          {
            icon: 'question',
            title: 'Who are the users of your application? ',
            description: 'Describe the roles and needs of your target users',
            type: 'see-attached-textbox',
            fieldName: 'details.appDefinition.users'
          }
        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Notes',
        description: 'Add any other important information regarding your project (e.g., links to documents or existing applications, budget or timing constraints)',
        type: 'notes'
      },
      {
        id: 'files',
        required: isFileRequired,
        title: (project) => `Project Files (${_.get(project, 'attachments', []).length})` || 'Files',
        description: '',
        type: 'files',
        fieldName: 'attachments'
      }
    ]
  },
  {
    id: 'appScreens',
    required: true,
    title: 'App Screens',
    description: (
      <span>
        Please describe all the primary screens first. It is important to think about the biggest
        problem of your application, rather than list all possible screens. Well documented and
        researched design patterns like <strong>Settings</strong>, <strong>Search</strong>, <strong>Listing</strong>, <strong>Log In</strong>, <strong>Registration</strong> do not need
        to be the focus of the design, unless you're doing something transformative with said
        screens. In that case please list in details what is the novel approach for your screens.
      </span>
    ),
    subSections: [
      {
        id: 'screens',
        required: true,
        fieldName: 'details.appScreens.screens',
        title: 'Screens',
        hideTitle: true,
        description: 'Add any other important information regarding your project (e.g., links to documents or existing applications, budget or timeing constraints)',
        type: 'screens',
        questions: [
          {
            icon: 'question',
            title: 'Screen name',
            required: true,
            description: 'Describe your objectives for creating this application',
            type: 'textinput',
            fieldName: 'name',
            validationError: 'Screen name cannot be blank',
            validations: 'isRequired'
          },
          {
            icon: 'question',
            title: 'What are the things the user can do on this screen?',
            required: true,
            description: 'What are the important features/capabilities that the screen provides to your end users?',
            type: 'textbox',
            fieldName: 'description',
            validationError: 'Answer cannot be blank',
            validations: 'isRequired'
          },
          {
            icon: 'question',
            title: 'Screen importance',
            required: true,
            description: 'Pick how important is this screen for your project from 1 to 10',
            type: 'select-dropdown',
            fieldName: 'importanceLevel',
            options: [
              {value: 1, title: '1'},
              {value: 2, title: '2'},
              {value: 3, title: '3'},
              {value: 4, title: '4'},
              {value: 5, title: '5'},
              {value: 6, title: '6'},
              {value: 7, title: '7'},
              {value: 8, title: '8'},
              {value: 9, title: '9'},
              {value: 10, title: '10'}
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'designSpecification',
    required: false,
    title: 'Design Guidelines',
    description: 'Define the visual style for your application or provide a style guide or brand guidelines. Skip this section (or particular questions) if you don\'t have any preferences or restrictions.',
    subSections: [
      {
        id: 'questions',
        required: false,
        hideTitle: true,
        title: 'Questions',
        description: '',
        type: 'questions',
        questions: [
          {
            id: 'guidelines',
            title: 'Guidelines',
            description: 'Do you have brand guidelines that need to be followed? If yes, please include a link or attach them in the definition section, above.',
            type: 'textbox',
            // required: false,
            fieldName: 'details.designSpecification.guidelines'
          },
          {
            id: 'examples',
            title: 'Examples',
            description: 'Are there any apps or sites that have a look and feel that you would want used as inspiration? Please provide links or examples.',
            type: 'textbox',
            // required: false,
            fieldName: 'details.designSpecification.examples'
          },
          {
            id: 'excludeExamples',
            // required: false,
            fieldName: 'details.designSpecification.excludeExamples',
            title: 'Exclude Examples',
            description: 'On the other hand, are there any apps or sites that you dislike? Please provide links or examples.',
            type: 'textbox'
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
    productName: 'Wireframes',
    required: true,
    description: 'Answer just a few questions about your application. You can also provide the needed information in a supporting-document - upload it below or add a link in the notes section.',
    subSections: [
      {
        id: 'projectName',
        required: true,
        validationError: 'Please provide a name to your project',
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
            icon: 'question',
            required: true,
            validationError: 'Please let us know the number of screens required',
            title: 'How many screens do you need designed?',
            description: 'This is the most popular project size that can get a medium-sized app designed in a breeze',
            fieldName: 'details.appDefinition.numberScreens.value',
            type: 'tiled-radio-group',
            options: [
              {value: '10', title: 'screens', icon: NumberText, iconOptions: { number: '10' }, desc: '7-10 days', price: 5000},
              {value: '15', title: 'screens', icon: NumberText, iconOptions: { number: '15' }, desc: '10-12 days', price: 7000}
            ]
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please let us know the target device',
            title: 'Which is your primary device target?',
            description: 'Select only the device that you need to develop for. \
                          In most cases limiting the scope of your project would result \
                          in better final result. Topcoder recommends to always start \
                          with the mobile phone view and expand to other devices as your \
                          app matures.',
            fieldName: 'details.appDefinition.primaryTarget.value',
            type: 'tiled-radio-group',
            options: [
              {value: 'Phone', title: 'Phone', icon: Icons.IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'Tablet', title: 'Tablet', icon: Icons.IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'Desktop', title: 'Desktop', icon: Icons.IconTechOutlineDesktop, iconOptions: { fill: '#00000'}, desc: 'all OS'},
              {value: 'Wearable', title: 'Wearable', icon: Icons.IconTechOutlineWatchApple, iconOptions: { fill: '#00000'}, desc: 'Watch OS, Android Wear'}
            ]
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please provide description',
            id: 'projectInfo',
            fieldName: 'description',
            description: 'Brief Description',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please let us know the goal of your application',
            title: 'What is the goal of your application? How will people use it?',
            description: 'Describe your objectives for creating this application',
            type: 'textbox',
            fieldName: 'details.appDefinition.goal.value'
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please let us know users of your application',
            title: 'Who are the users of your application? ',
            description: 'Describe the roles and needs of your target users',
            type: 'textbox',
            fieldName: 'details.appDefinition.users.value'
          }
        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Notes',
        description: 'Add any other important information regarding your project (e.g., links to documents or existing applications, budget or timing constraints)',
        type: 'notes'
      }
    ]
  }
]