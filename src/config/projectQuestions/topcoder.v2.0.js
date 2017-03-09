import _ from 'lodash'
import { Icons } from 'appirio-tech-react-components'

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
        description: 'Add any other important information regarding your project (e.g., links to documents or existing applications, budget or timeing constraints)',
        type: 'notes'
      }
    ]
  }
]

export default sections