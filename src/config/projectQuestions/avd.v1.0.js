import React from 'react'
import _ from 'lodash'
import { Icons } from 'appirio-tech-react-components'
import SVGNumberText from '../../components/SVGNumberText/SVGNumberText'

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
    title: 'App Definition',
    required: true,
    pricePerPage: 1000,
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
        id: 'projectInfo',
        required: true,
        fieldName: 'description',
        description: 'Description',
        title: 'Project Info',
        type: 'notes'
      },
      {
        id: 'questions',
        required: true,
        title: 'Questions',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'question',
            title: 'How many screens do you need designed?',
            description: 'This is the most popular project size that can get a medium-sized app designed in a breeze',
            fieldName: 'details.appDefinition.numberScreens',
            type: 'see-attached-tiled-radio-group',
            options: [
              {value: '1', title: 'screens', icon: SVGNumberText, iconOptions: { number: '1' }, desc: '3-5 days'},
              {value: '3', title: 'screens', icon: SVGNumberText, iconOptions: { number: '3' }, desc: '5-10 days'},
              {value: '5', title: 'screens', icon: SVGNumberText, iconOptions: { number: '5' }, desc: '7-10 days'},
              {value: '7', title: 'screens', icon: SVGNumberText, iconOptions: { number: '7' }, desc: '10-14 days'}
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
            type: 'see-attached-tiled-radio-group',
            options: [
              {value: 'Phone', title: 'Phone', icon: Icons.IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'Tablet', title: 'Tablet', icon: Icons.IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'Desktop', title: 'Desktop', icon: Icons.IconTechOutlineDesktop, iconOptions: { fill: '#00000'}, desc: 'all OS'},
              {value: 'Wearable', title: 'Wearable', icon: Icons.IconTechOutlineWatchApple, iconOptions: { fill: '#00000'}, desc: 'Watch OS, Android Wear'}
            ]
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
        description: 'Add any other important information regarding your project (e.g., links to documents or existing applications, budget or timeing constraints)',
        type: 'screens',
        questions: [
          {
            icon: 'question',
            title: 'Screen name',
            description: 'Describe your objectives for creating this application',
            type: 'textinput',
            fieldName: 'name',
            validationError: 'Screen name cannot be blank'
          },
          {
            icon: 'question',
            title: 'What are the things the user can do on this screen?',
            description: 'What are the important features/capabilities that the screen provides to your end users?',
            type: 'textbox',
            fieldName: 'description',
            validationError: 'Answer cannot be blank'
          },
          {
            icon: 'question',
            title: 'Screen importance',
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
              {value: 'serif', title: 'Serif', icon: Icons.IconTcSpecTypeSerif, iconOptions: { fill: '#00000'}, desc: 'formal, old style'},
              {value: 'sanSerif', title: 'Sans Serif', icon: Icons.IconTcSpecTypeSansSerif, iconOptions: { fill: '#00000'}, desc: 'clean, modern, informal'}
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
              {value: 'flatColor', title: 'Flat Color', icon: Icons.IconTcSpecIconTypeColorHome, iconOptions: { fill: '#00000'}, desc: 'playful'},
              {value: 'thinLine', title: 'Thin Line', icon: Icons.IconTcSpecIconTypeOutlineHome, iconOptions: { fill: '#00000'}, desc: 'modern'},
              {value: 'solidLine', title: 'Solid Line', icon: Icons.IconTcSpecIconTypeGlyphHome, iconOptions: { fill: '#00000'}, desc: 'classic'}
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
  }
]

export default sections
