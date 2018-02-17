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
import NumberText from '../../components/NumberText/NumberText'
import { isFileRequired, findTitle, findFilesSectionTitle } from '../projectWizard'

const sections = [
  {
    id: 'appDefinition',
    title: findTitle,
    required: true,
    pricePerPage: 1000,
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
            options: [
              {value: '1', title: 'screens', icon: NumberText, iconOptions: { number: '1' }, desc: '3-5 days'},
              {value: '3', title: 'screens', icon: NumberText, iconOptions: { number: '3' }, desc: '5-10 days'},
              {value: '5', title: 'screens', icon: NumberText, iconOptions: { number: '5' }, desc: '7-10 days'},
              {value: '10', title: 'screens', icon: NumberText, iconOptions: { number: '10' }, desc: '10-14 days'}
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
            validations: 'isRequired,minLength:160',
            validationErrors: {
              isRequired : 'Please provide a description',
              minLength  : 'Please enter at least 160 characters'
            },
            description: 'Brief Description',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'Who are the users of your application? ',
            description: 'Describe the roles and needs of your target users',
            type: 'see-attached-textbox',
            fieldName: 'details.appDefinition.users'
          },
          {
            icon: 'question',
            title: 'Feature requirements',
            description: 'Please list all the features you would like in your application. You can use our wizard to pick from common features or define your own.',
            type: 'see-attached-features',
            fieldName: 'details.appDefinition.features'
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
            icon: 'question',
            title: 'What font style do you prefer? (Pick one)',
            description: 'The typography used in your designs will fit within these broad font styles',
            type: 'tiled-radio-group',
            options: [
              {value: 'serif', title: 'Serif', icon: IconTcSpecTypeSerif, iconOptions: { fill: '#00000'}, desc: 'formal, old style'},
              {value: 'sanSerif', title: 'Sans Serif', icon: IconTcSpecTypeSansSerif, iconOptions: { fill: '#00000'}, desc: 'clean, modern, informal'}
            ],
            fieldName: 'details.designSpecification.fontStyle'
          },
          {
            icon: 'question',
            title: 'What colors do you like? (Select all that apply)',
            description: 'Your preferred colors will be used to guide the shading in your designs',
            type: 'colors',
            defaultColors: [],
            fieldName: 'details.designSpecification.colors'
          },
          {
            icon: 'question',
            title: 'What icon style do you prefer? (Pick one)',
            description: 'Icons within your designs will follow these styles',
            type: 'tiled-radio-group',
            options: [
              {value: 'flatColor', title: 'Flat Color', icon: IconTcSpecIconTypeColorHome, iconOptions: { fill: '#00000'}, desc: 'playful'},
              {value: 'thinLine', title: 'Thin Line', icon: IconTcSpecIconTypeOutlineHome, iconOptions: { fill: '#00000'}, desc: 'modern'},
              {value: 'solidLine', title: 'Solid Line', icon: IconTcSpecIconTypeGlyphHome, iconOptions: { fill: '#00000'}, desc: 'classic'}
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
        description: 'Add any other important information regarding your project (e.g., links to documents or existing applications, budget or timing constraints)',
        type: 'notes'
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
    pricePerPage: 1000,
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
              {value: '1', title: 'screens', icon: NumberText, iconOptions: { number: '1' }, desc: '3-5 days'},
              {value: '3', title: 'screens', icon: NumberText, iconOptions: { number: '3' }, desc: '5-10 days'},
              {value: '5', title: 'screens', icon: NumberText, iconOptions: { number: '5' }, desc: '7-10 days'},
              {value: '10', title: 'screens', icon: NumberText, iconOptions: { number: '10' }, desc: '10-14 days'}
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
