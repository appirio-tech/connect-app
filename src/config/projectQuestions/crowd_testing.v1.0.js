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
    title: (project, showProduct) => {
      const product = _.get(project, 'details.products[0]')
      if (showProduct && product) {
        const prd = findProduct(product)
        if (prd) return prd
      }
      return 'Definition'
    },
    required: true,
    description: 'Please answer a few basic questions about your project. You can also provide the needed information in a supporting document--add a link in the notes section or upload it below.',
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
            validationError: 'Please let us know what kind of testing you would like to execute',
            title: 'What kind of crowd testing are you interested in?',
            description: 'Structured testing focuses on the execution of test cases, whereas unstructured testing lets the testers create their own path through an application as an end user might.',
            fieldName: 'details.appDefinition.testType',
            type: 'tiled-radio-group',
            options: [
              {value: 'unstructured', title: 'Unstructured', icon: Icons.IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'structured', title: 'Structured', icon: Icons.IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'dontKnow', title: 'Do not know', icon: 'icon-dont-know', iconOptions: { fill: '#00000'}, desc: ''}
            ]
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please let us know the expected hours',
            title: 'Approximately how many hours of crowd testing are you \
                      looking for your app?',
            description: 'If you know roughly the amount of time you want spent \
                       testing the application please list it here. If you do \
                       not know how many hours you require your copilot can \
                       assist you.',
            fieldName: 'details.appDefinition.expectedHours',
            type: 'tiled-radio-group',
            options: [
              {value: 'upto100', title: 'hours', icon: NumberText, iconOptions: { number: '100' }, desc: 'or fewer'},
              {value: 'upTo250', title: 'hours', icon: NumberText, iconOptions: { number: '250' }, desc: 'or fewer'},
              {value: 'upTo500', title: 'hours', icon: NumberText, iconOptions: { number: '500' }, desc: 'or fewer'},
              {value: 'dontKnow', title: 'Do not know', icon: 'icon-dont-know', iconOptions: { fill: '#00000'}, desc: 'or not applicable'}
            ]
          },
          {
            icon: 'question',
            title: 'In which geographies would you like to test?',
            description: '',
            type: 'checkbox-group',
            options: [
              {value: 'africa', label: 'Africa'},
              {value: 'asia', label: 'Asia'},
              {value: 'australia', label: 'Australia'},
              {value: 'europe', label: 'Europe'},
              {value: 'northAmerica', label: 'North America'},
              {value: 'southAmerica', label: 'South America'}
            ],
            fieldName: 'details.appDefinition.geographies'
          },
          {
            icon: 'question',
            title: 'Approximately how many platform/device - browser configurations to be tested?',
            description: '',
            fieldName: 'details.appDefinition.browserConfigurations',
            type: 'tiled-radio-group',
            options: [
              {value: 'upto5', title: 'configurations', icon: NumberText, iconOptions: { number: '5' }, desc: 'or fewer'},
              {value: 'upTo10', title: 'configurations', icon: NumberText, iconOptions: { number: '10' }, desc: 'or fewer'},
              {value: 'upTo20', title: 'configurations', icon: NumberText, iconOptions: { number: '20' }, desc: 'or fewer'},
              {value: 'dontKnow', title: 'Do not know', icon: Icons.IconTechOutlineWatchApple, iconOptions: { fill: '#00000'}, desc: 'We will find the best fit for you.'}
            ]
          }
        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Notes',
        description: 'Please enter any additional information like \
                      requirements and/or test cases.  After creating \
                       your project you will be able to upload files.',
        type: 'notes'
      }
    ]
  },
  {
    id: 'testingNeeds',
    required: false,
    title: 'Testing Needs',
    description: 'Please answer these additional questions to better help us understand your needs.',
    subSections: [
      {
        id: 'scope',
        required: false,
        title: 'Scope',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'question',
            id: 'testingNeeds.description',
            fieldName: 'description',
            description: '',
            title: 'Please describe your website and/or application.',
            type: 'textbox'
          },
          {
            icon: 'question',
            id: 'testingNeeds.inScope',
            fieldName: 'In Scope',
            description: '',
            title: 'Please describe which features or components are in-scope in this testing effort.',
            type: 'textbox'
          },
          {
            icon: 'question',
            id: 'testingNeeds.outOfScope',
            fieldName: 'Out of Scope',
            description: '',
            title: 'Are any features or components out of scope? If yes, please describe.',
            type: 'textbox'
          },
          {
            icon: 'question',
            id: 'testingNeeds.duration',
            fieldName: 'Duration',
            description: '',
            title: 'Do you have a specific timeline for testing? If so, please provide approximate start and end dates.',
            type: 'textbox'
          }
        ]
      },
      {
        id: 'notes',
        required: false,
        fieldName: 'details.testingNeeds.notes',
        title: 'Notes',
        description: 'Please log any other notes or comments related to scope here.',
        type: 'notes'
      }
    ]
  }/*,
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
  }*/
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
            validationError: 'Please let us know what kind of testing you would like to execute',
            title: 'What kind of crowd testing are you interested in?',
            description: 'Structured testing focuses on the execution of test cases, whereas unstructured testing lets the testers create their own path through an application as an end user might.',
            fieldName: 'details.appDefinition.testType',
            type: 'tiled-radio-group',
            options: [
              {value: 'unstructured', title: 'Unstructured', icon: Icons.IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'structured', title: 'Structured', icon: Icons.IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'dontKnow', title: 'Do not know', icon: 'icon-dont-know', iconOptions: { fill: '#00000'}, desc: ''}
            ]
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please let us know the expected hours',
            title: 'Approximately how many hours of crowd testing are you \
                      looking for your app?',
            description: 'If you know roughly the amount of time you want spent \
                       testing the application please list it here. If you do \
                       not know how many hours you require your copilot can \
                       assist you.',
            fieldName: 'details.appDefinition.expectedHours',
            type: 'tiled-radio-group',
            options: [
              {value: 'upto100', title: 'hours', icon: NumberText, iconOptions: { number: '100' }, desc: 'or fewer'},
              {value: 'upTo250', title: 'hours', icon: NumberText, iconOptions: { number: '250' }, desc: 'or fewer'},
              {value: 'upTo500', title: 'hours', icon: NumberText, iconOptions: { number: '500' }, desc: 'or fewer'},
              {value: 'dontKnow', title: 'Do not know', icon: 'icon-dont-know', iconOptions: { fill: '#00000'}, desc: 'or not applicable'}
            ]
          },
          {
            icon: 'question',
            title: 'In which geographies would you like to test?',
            description: '',
            type: 'checkbox-group',
            options: [
              {value: 'africa', label: 'Africa'},
              {value: 'asia', label: 'Asia'},
              {value: 'australia', label: 'Australia'},
              {value: 'europe', label: 'Europe'},
              {value: 'northAmerica', label: 'North America'},
              {value: 'southAmerica', label: 'South America'}
            ],
            fieldName: 'details.appDefinition.geographies'
          },
          {
            icon: 'question',
            title: 'Approximately how many platform/device - browser configurations to be tested?',
            description: '',
            fieldName: 'details.appDefinition.browserConfigurations',
            type: 'tiled-radio-group',
            options: [
              {value: 'upto5', title: 'configurations', icon: NumberText, iconOptions: { number: '5' }, desc: 'or fewer'},
              {value: 'upTo10', title: 'configurations', icon: NumberText, iconOptions: { number: '10' }, desc: 'or fewer'},
              {value: 'upTo20', title: 'configurations', icon: NumberText, iconOptions: { number: '20' }, desc: 'or fewer'},
              {value: 'dontKnow', title: 'Do not know', icon: Icons.IconTechOutlineWatchApple, iconOptions: { fill: '#00000'}, desc: 'We will find the best fit for you.'}
            ]
          }
          /*{
            id: 'projectInfo',
            required: true,
            validationError: 'Please provide any user accounts \
                             or passwords to access the acount',
            fieldName: 'description',
            description: 'Please provide any user accounts \
                             or passwords to access the acount',
            title: 'Access Information',
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
          }*/
        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Notes',
        description: 'Please enter any additional information like \
                      requirements and/or test cases.  After creating \
                       your project you will be able to upload files.',
        type: 'notes'
      }
    ]
  }
]
