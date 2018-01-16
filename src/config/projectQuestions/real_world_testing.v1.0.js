import _ from 'lodash'
import { Icons } from 'appirio-tech-react-components'
import SVGIcons from '../../components/Icons/Icons'
// import NumberText from '../../components/NumberText/NumberText'
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
        if (prd) return prd.name
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
              {value: 'unstructured', title: 'Unstructured', icon: SVGIcons.IconTestUnstructured, iconOptions: { filePath: 'icon-test-unstructured', fill: '#00000'}, desc: '', price: 6000},
              {value: 'structured', title: 'Structured', icon: SVGIcons.IconTestStructured, iconOptions: { filePath: 'icon-test-structured', fill: '#00000'}, desc: '', price: 4000},
              {value: 'dontKnow', title: 'Do not know', icon: SVGIcons.IconDontKnow, iconOptions: { filePath: 'icon-dont-know', fill: '#00000'}, desc: ''}
            ]
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please let us know if you have test cases.',
            title: 'Do you have test cases written?',
            description: 'Do you have test cases you would like executed? These are essential when running structured testing and optional for unstructured testing. If you are planning a structured test cycle and do not have test cases do not worry, we can help!',
            fieldName: 'details.appDefinition.expectedHours',
            type: 'radio-group',
            options: [
              {value: 'true', label: 'Yes I have test cases.'},
              {value: 'false', label: 'No I do not have test cases.'}
            ]
          },
          {
            id: 'projectInfo',
            fieldName: 'description',
            // required is not needed if we specifiy validations
            // required: true,
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
            title: 'Please tell us about your users.',
            description: 'Please share information about your end users. Where are they from? What is their goal? This information can help you find the best testers for your application.',
            type: 'textbox',
            fieldName: 'details.appDefinition.userInfo'
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
              {value: 'phone', title: 'Phone', icon: Icons.IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'tablet', title: 'Tablet', icon: Icons.IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'desktop', title: 'Desktop', icon: Icons.IconTechOutlineDesktop, iconOptions: { fill: '#00000'}, desc: 'all OS'},
              {value: 'wearable', title: 'Wearable', icon: Icons.IconTechOutlineWatchApple, iconOptions: { fill: '#00000'}, desc: 'Watch OS, Android Wear'}
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
            fieldName: 'details.testingNeeds.description',
            description: '',
            title: 'Please describe your website and/or application.',
            type: 'textbox'
          },
          {
            icon: 'question',
            id: 'testingNeeds.inScope',
            fieldName: 'details.testingNeeds.inScope',
            description: '',
            title: 'Please describe which features or components are in-scope in this testing effort.',
            type: 'textbox'
          },
          {
            icon: 'question',
            id: 'testingNeeds.outOfScope',
            fieldName: 'details.testingNeeds.outOfScope',
            description: '',
            title: 'Are any features or components out of scope? If yes, please describe.',
            type: 'textbox'
          },
          {
            icon: 'question',
            id: 'testingNeeds.duration',
            fieldName: 'details.testingNeeds.duration',
            description: '',
            title: 'Do you have a specific timeline for testing? If so, please provide approximate start and end dates.',
            type: 'textbox'
          }
        ]
      },
      {
        id: 'testerDetails',
        required: false,
        title: 'Tester Details',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'question',
            id: 'testerDetails.demographics',
            fieldName: 'details.testerDetails.demographics',
            description: '',
            title: 'Do you have preferred demographics you would like to target?',
            type: 'textbox'
          },
          {
            icon: 'question',
            id: 'testerDetails.geographies',
            fieldName: 'details.testerDetails.geographies',
            description: '',
            title: 'Would you like to target any specific geographies?',
            type: 'textbox'
          },
          {
            icon: 'question',
            id: 'testerDetails.skills',
            fieldName: 'details.testerDetails.skills',
            description: '',
            title: 'Are any specific skills required to test your application? If so, please list them.',
            type: 'textbox'
          }
        ]
      },
      {
        id: 'testEnvironment',
        required: false,
        title: 'Testing Enviroment',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'question',
            id: 'testEnvironment.environmentDetails',
            fieldName: 'details.testEnvironment.environmentDetails',
            description: '',
            title: 'Do you have a version of the application available for testers to access? If so, please provide details. Details can include a test URL, access information, etc.',
            type: 'textbox'
          },
          {
            icon: 'question',
            id: 'testEnvironment.assets',
            fieldName: 'details.testEnvironment.assets',
            description: '',
            title: 'Are any test assets available? For exmaple: test plan, test scenario, test scripts, test data.',
            type: 'textbox'
          },
          {
            icon: 'question',
            id: 'testEnvironment.other',
            fieldName: 'details.testEnvironment.otherInformation',
            description: '',
            title: 'Are there any other specific details related to the environment you can share?',
            type: 'textbox'
          }
        ]
      },
      {
        id: 'targetApplication',
        required: false,
        title: 'Target Application',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'question',
            id: 'targetApplication.description',
            fieldName: 'details.targetApplication.description',
            description: '',
            title: 'Please describe your application.',
            type: 'textbox'
          },
          {
            icon: 'question',
            id: 'targetApplication.platform',
            fieldName: 'details.targetApplication.platform',
            description: '',
            title: 'Please list all platforms the application should be tested on.',
            type: 'textbox'
          },
          {
            icon: 'question',
            id: 'targetApplication.training',
            fieldName: 'details.targetApplication.training',
            description: '',
            title: 'Does the application require training to utilize it properly? If so, are you able to provide these inputs?',
            type: 'textbox'
          }
        ]
      }, {
        id: 'cyclePreferences',
        required: false,
        title: 'Test Cycle Preferences',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'question',
            id: 'preferences.suggestions',
            fieldName: 'details.cyclePreferences.usabilitySuggestions',
            description: '',
            title: 'Would you like usability suggestions included in the issue report?',
            type: 'textbox'
          },
          {
            icon: 'question',
            id: 'preferences.omissions',
            fieldName: 'details.cyclePreferences.omissions',
            description: '',
            title: 'Are there any types of defects you would like ommitted from issue reports?',
            type: 'textbox'
          }
        ]
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
  }
/*,
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
              {value: 'unstructured', title: 'Unstructured', icon: SVGIcons.IconTestUnstructured, iconOptions: { filePath: 'icon-test-unstructured', fill: '#00000'}, desc: ''},
              {value: 'structured', title: 'Structured', icon: SVGIcons.IconTestStructured, iconOptions: { filePath: 'icon-test-structured',  fill: '#00000'}, desc: ''},
              {value: 'dontKnow', title: 'Do not know', icon: SVGIcons.IconDontKnow, iconOptions: { filePath: 'icon-dont-know', fill: '#00000'}, desc: ''}
            ]
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please let us know if you have test cases.',
            title: 'Do you have test cases written?',
            description: 'Do you have test cases you would like executed? These are essential when running structured testing and optional for unstructured testing. If you are planning a structured test cycle and do not have test cases do not worry, we can help!',
            fieldName: 'details.appDefinition.expectedHours',
            type: 'radio-group',
            options: [
              {value: 'true', label: 'Yes I have test cases.'},
              {value: 'false', label: 'No I do not have test cases.'}
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
            title: 'Please tell us about your users.',
            description: 'Please share information about your end users. Where are they from? What is their goal? This information can help us find the best testers for your application.',
            type: 'textbox',
            fieldName: 'details.appDefinition.userInfo'
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
              {value: 'phone', title: 'Phone', icon: Icons.IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'tablet', title: 'Tablet', icon: Icons.IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: 'iOS, Android, Hybrid'},
              {value: 'desktop', title: 'Desktop', icon: Icons.IconTechOutlineDesktop, iconOptions: { fill: '#00000'}, desc: 'all OS'},
              {value: 'wearable', title: 'Wearable', icon: Icons.IconTechOutlineWatchApple, iconOptions: { fill: '#00000'}, desc: 'Watch OS, Android Wear'}
            ]
          }
          /*{
            icon: 'question',
            title: 'Approximately how many platform/device - browser configurations to be tested?',
            description: '',
            fieldName: 'details.appDefinition.browserConfigurations',
            type: 'tiled-radio-group',
            options: [
              {value: 'upto5', title: 'configurations', icon: NumberText, iconOptions: { number: '5' }, desc: 'or fewer'},
              {value: 'upTo10', title: 'configurations', icon: NumberText, iconOptions: { number: '10' }, desc: 'or fewer'},
              {value: 'upTo20', title: 'configurations', icon: NumberText, iconOptions: { number: '20' }, desc: 'or fewer'},
              {value: 'dontKnow', title: 'Do not know', icon: SVGIcons, iconOptions: { filePath: 'icon-dont-know',  fill: '#00000'}, desc: 'We will find the best fit for you.'}
            ]
          }
          {
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
