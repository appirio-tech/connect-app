import _ from 'lodash'
import { Icons } from 'appirio-tech-react-components'
import { isFileRequired, findTitle } from '../projectWizard'

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
            title: 'Which is your primary device target?',
            description: 'Select only the device that you need to develop for. \
                          In most cases limiting the scope of your project would result \
                          in better final result. Topcoder recommends to always start \
                          with the mobile phone view and expand to other devices as your \
                          app matures.',
            fieldName: 'details.appDefinition.primaryTarget',
            type: 'tiled-radio-group',
            options: [
              {value: 'phone', title: 'Phone', icon: Icons.IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'tablet', title: 'Tablet', icon: Icons.IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'desktop', title: 'Desktop', icon: Icons.IconTechOutlineDesktop, iconOptions: { fill: '#00000'}, desc: 'all OS'},
              {value: 'wearable', title: 'Wearable', icon: Icons.IconTechOutlineWatchApple, iconOptions: { fill: '#00000'}, desc: 'Watch OS, Android Wear'}
            ]
          },
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
        title: (project) => `Project Files (${_.get(project, 'attachments', []).length})` || 'Files',
        description: '',
        type: 'files',
        fieldName: 'attachments'
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
        description: 'Add any other important information regarding your project (e.g., links to documents or existing applications, budget or timing constraints)',
        type: 'notes'
      }
    ]
  },
  {
    id: 'devSpecification',
    title: 'Development Specification',
    description: 'Define some basic technical requirements for your application or provide any architecture or technical guidelines. Skip this section if you dont know what is required.',
    required: false,
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
            icon: 'question',
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
            icon: 'question',
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
        fieldName: 'details.devSpecification.notes',
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
              {value: 'phone', title: 'Phone', icon: Icons.IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'tablet', title: 'Tablet', icon: Icons.IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'desktop', title: 'Desktop', icon: Icons.IconTechOutlineDesktop, iconOptions: { fill: '#00000'}, desc: 'all OS'},
              {value: 'wearable', title: 'Wearable', icon: Icons.IconTechOutlineWatchApple, iconOptions: { fill: '#00000'}, desc: 'Watch OS, Android Wear'}
            ]
          },
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