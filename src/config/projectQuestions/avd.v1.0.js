import React from 'react' // eslint-disable-line no-unused-vars
import IconTechOutlineMobile from  '../../assets/icons/icon-tech-outline-mobile.svg'
import IconTechOutlineTablet from  '../../assets/icons/icon-tech-outline-tablet.svg'
import IconTechOutlineDesktop from  '../../assets/icons/icon-tech-outline-desktop.svg'
import IconTechOutlineWatchApple from  '../../assets/icons/icon-tech-outline-watch-apple.svg'
import NumberText from '../../components/NumberText/NumberText'
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
            icon: 'question',
            title: 'How many screens do you need designed?',
            description: 'This is the most popular project size that can get a medium-sized app designed in a breeze',
            fieldName: 'details.appDefinition.numberScreens',
            type: 'tiled-radio-group',
            affectsQuickQuote: true,
            options: [
              {value: '1-3', title: 'screens', icon: NumberText, iconOptions: { number: '1-3' }, desc: '5-7 days', quoteUp: 0, minTimeUp: 0, maxTimeUp: 0},
              {value: '4-8', title: 'screens', icon: NumberText, iconOptions: { number: '4-8' }, desc: '7-10 days', quoteUp: 2000, minTimeUp: 3, maxTimeUp: 5},
              {value: '9-15', title: 'screens', icon: NumberText, iconOptions: { number: '9-15' }, desc: '8-10 days', quoteUp: 3500, minTimeUp: 8, maxTimeUp: 12}
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
              {value: 'Phone', title: 'Phone', icon: IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'Tablet', title: 'Tablet', icon: IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'Desktop', title: 'Desktop', icon: IconTechOutlineDesktop, iconOptions: { fill: '#00000'}, desc: 'all OS'},
              {value: 'Wearable', title: 'Wearable', icon: IconTechOutlineWatchApple, iconOptions: { fill: '#00000'}, desc: 'Watch OS, Android Wear'}
            ]
          },
          {
            icon: 'question',
            id: 'projectInfo',
            fieldName: 'description',
            description: 'Brief Description',
            validations: 'isRequired,minLength:160',
            validationErrors: {
              isRequired : 'Please provide a description',
              minLength  : 'Please enter at least 160 characters'
            },
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
        description: 'Add any other important information regarding your project (e.g., links to documents or existing applications)',
        type: 'notes'
      },
      {
        id: 'files',
        required: isFileRequired,
        title: findFilesSectionTitle,
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
        description: 'Add any other important information regarding your project (e.g., links to documents or existing applications, budget or timing constraints)',
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
            icon: 'question',
            required: true,
            validationError: 'Please let us know the number of screens required',
            title: 'How many screens do you need designed?',
            description: 'This is the most popular project size that can get a medium-sized app designed in a breeze',
            fieldName: 'details.appDefinition.numberScreens',
            type: 'tiled-radio-group',
            options: [
              {value: '1-3', title: 'screens', icon: NumberText, iconOptions: { number: '1-3' }, desc: '5-7 days', price: 5000},
              {value: '4-8', title: 'screens', icon: NumberText, iconOptions: { number: '4-8' }, desc: '7-10 days', price: 7000},
              {value: '9-15', title: 'screens', icon: NumberText, iconOptions: { number: '9-15' }, desc: '8-10 days', price: 8500}
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
            fieldName: 'details.appDefinition.primaryTarget',
            type: 'tiled-radio-group',
            options: [
              {value: 'Phone', title: 'Phone', icon: IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'Tablet', title: 'Tablet', icon: IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'Desktop', title: 'Desktop', icon: IconTechOutlineDesktop, iconOptions: { fill: '#00000'}, desc: 'all OS'},
              {value: 'Wearable', title: 'Wearable', icon: IconTechOutlineWatchApple, iconOptions: { fill: '#00000'}, desc: 'Watch OS, Android Wear'}
            ]
          },
          {
            icon: 'question',
            // required is not needed if we specifiy validations
            // required: true,
            validations: 'isRequired,minLength:160',
            validationErrors: {
              isRequired : 'Please provide a description',
              minLength  : 'Please enter at least 160 characters'
            },
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
        description: 'Add any other important information regarding your project (e.g., links to documents or existing applications)',
        type: 'notes'
      }
    ]
  }
]