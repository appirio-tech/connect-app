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
            title: 'What type of tests would you like to be conducted?',
            description: ' (Select one/many from the list above)',
            type: 'checkbox-group',
            options: [
              {value: 'load', label: 'Load'},
              {value: 'stress', label: 'Stress'},
              {value: 'endurance', label: 'Endurance'},
              {value: 'other', label: 'Other'}
            ],
            fieldName: 'details.appDefinition.perfTestingTypes',
            required: true,
            validationError: 'Please select at least one type of tests'
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please let us know if you have test cases.',
            title: 'Do you have test cases written?',
            description: 'Do you have test cases you would like executed? These are essential when running structured testing and optional for unstructured testing. If you are planning a structured test cycle and do not have test cases do not worry, we can help!',
            fieldName: 'details.appDefinition.haveTestCases',
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
        id: 'spoc',
        title: 'SPOC',
        type: 'questions',
        description: '',
        required: true,
        questions: [
          {
            icon: 'question',
            fieldName: 'details.spoc.business.name',
            description: '',
            title: 'Name of the Business SPOC',
            type: 'textbox',
            required: true,
            validationError: 'Please provide name of business SPOC'
          },
          {
            icon: 'question',
            fieldName: 'details.spoc.business.email',
            description: '',
            title: 'Email of the Business SPOC',
            type: 'textbox',
            // required is not needed if we specifiy validations
            // required: true,
            validations: 'isRequired,isEmail',
            validationErrors: {
              isRequired : 'Please provide email of business SPOC',
              isEmail  : 'Please enter a valid email'
            }
          },
          {
            icon: 'question',
            fieldName: 'details.spoc.testing.name',
            description: '',
            title: 'Name of the Testing SPOC',
            type: 'textbox',
            required: true,
            validationError: 'Please provide name of testing SPOC'
          },
          {
            icon: 'question',
            fieldName: 'details.spoc.testing.email',
            description: '',
            title: 'Email of the Testing SPOC',
            type: 'textbox',
            // required is not needed if we specifiy validations
            // required: true,
            validations: 'isRequired,isEmail',
            validationErrors: {
              isRequired : 'Please provide email of testing SPOC',
              isEmail  : 'Please enter a valid email'
            }
          },
          {
            icon: 'question',
            fieldName: 'details.spoc.dev.name',
            description: '',
            title: 'Name of the development SPOC',
            type: 'textbox',
            required: true,
            validationError: 'Please provide name of development SPOC'
          },
          {
            icon: 'question',
            fieldName: 'details.spoc.dev.email',
            description: '',
            title: 'Email of the development SPOC',
            type: 'textbox',
            // required is not needed if we specifiy validations
            // required: true,
            validations: 'isRequired,isEmail',
            validationErrors: {
              isRequired : 'Please provide email of development SPOC',
              isEmail  : 'Please enter a valid email'
            }
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
            title: 'Expected load on the platform exercised during Performance Test? ',
            description: '',
            fieldName: 'details.testingNeeds.expectedLoad',
            type: 'tiled-radio-group',
            options: [
              {value: '100%', title: '% load', icon: NumberText, iconOptions: { number: '100' }, desc: 'load testing', price: 5000},
              {value: '120%', title: '% load', icon: NumberText, iconOptions: { number: '120' }, desc: 'stress testing', price: 7000},
              {value: '60%', title: '% load', icon: NumberText, iconOptions: { number: '60' }, desc: 'endurance testing', price: 7000}
            ],
            required: true,
            validationError: 'Please provide expected load'
          },
          {
            icon: 'question',
            title: 'Please select any additional add-ons?',
            description: 'estimated additional cost in ()',
            type: 'checkbox-group',
            options: [
              {value: 'scenario', label: 'Scenario Booster add 3 more ($1,000)'},
              {value: '250vusers', label: 'Add 250 vUsers ($1,000)'},
              {value: '2500vusers', label: 'Add 2500 vUsers ($4,000)'},
              {value: 'geo', label: 'Add additional Geography($1,500)'},
              {value: 'poc', label: 'Precurser to purchase - 1 Tool, 2 scripts,1 hour execution ($2,500)'},
              {value: 'strategy', label: 'Utilize consultant to tailor strategy ($3,000)'},
              {value: 'execution', label: 'Execution Booster extra 2 hours ($500)'},
              {value: 'mytool', label: 'Use my own testing tool ($2,500)'},
              {value: 'myscripts', label: 'Modify/Use own scripts ($5,000)'},
              {value: 'late', label: 'Late Entry - 1 week lead time ($2,000)'}
            ],
            fieldName: 'details.testingNeeds.addons'
          },
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
            id: 'targetApplication.appName',
            fieldName: 'details.targetApplication.appName',
            title: 'Please enter the name of the application being tested',
            description: 'Name of the application to be tested',
            type: 'textbox',
            required: true,
            validationError: 'Please provide name of the target application'
          },
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
            title: 'Please enter the name of the application being tested',
            description: 'Name of the application to be tested',
            type: 'textbox',
            fieldName: 'details.targetApplication.appName',
            required: true,
            validationError: 'Please provide name of the target application'
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
            description: '',
            title: 'Description of the Application being tested',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'What type of tests would you like to be conducted?',
            description: ' (Select one/many from the list above)',
            type: 'checkbox-group',
            options: [
              {value: 'load', label: 'Load'},
              {value: 'stress', label: 'Stress'},
              {value: 'endurance', label: 'Endurance'},
              {value: 'other', label: 'Other'}
            ],
            fieldName: 'details.appDefinition.perfTestingTypes',
            required: true,
            validationError: 'Please select at least one type of tests'
          },
          {
            icon: 'question',
            title: 'Expected load on the platform exercised during Performance Test? ',
            description: '',
            fieldName: 'details.testingNeeds.expectedLoad',
            type: 'tiled-radio-group',
            options: [
              {value: '100%', title: '% load', icon: NumberText, iconOptions: { number: '100' }, desc: 'load testing', price: 5000},
              {value: '120%', title: '% load', icon: NumberText, iconOptions: { number: '120' }, desc: 'stress testing', price: 7000},
              {value: '60%', title: '% load', icon: NumberText, iconOptions: { number: '60' }, desc: 'endurance testing', price: 7000}
            ],
            required: true,
            validationError: 'Please provide expected load'
          },
          {
            icon: 'question',
            title: 'Please select any additional add-ons?',
            description: 'estimated additional cost in ()',
            type: 'checkbox-group',
            options: [
              {value: 'scenario', label: 'Scenario Booster add 3 more ($1,000)'},
              {value: '250vusers', label: 'Add 250 vUsers ($1,000)'},
              {value: '2500vusers', label: 'Add 2500 vUsers ($4,000)'},
              {value: 'geo', label: 'Add additional Geography($1,500)'},
              {value: 'poc', label: 'Precurser to purchase - 1 Tool, 2 scripts,1 hour execution ($2,500)'},
              {value: 'strategy', label: 'Utilize consultant to tailor strategy ($3,000)'},
              {value: 'execution', label: 'Execution Booster extra 2 hours ($500)'},
              {value: 'mytool', label: 'Use my own testing tool ($2,500)'},
              {value: 'myscripts', label: 'Modify/Use own scripts ($5,000)'},
              {value: 'late', label: 'Late Entry - 1 week lead time ($2,000)'}
            ],
            fieldName: 'details.testingNeeds.addons'
          },
          {
            icon: 'question',
            fieldName: 'details.spoc.business.name',
            description: '',
            title: 'Name of the Business SPOC',
            type: 'textbox',
            required: true,
            validationError: 'Please provide name of business SPOC'
          },
          {
            icon: 'question',
            fieldName: 'details.spoc.business.email',
            description: '',
            title: 'Email of the Business SPOC',
            type: 'textbox',
            // required is not needed if we specifiy validations
            // required: true,
            validations: 'isRequired,isEmail',
            validationErrors: {
              isRequired : 'Please provide email of business SPOC',
              isEmail  : 'Please enter a valid email'
            }
          },
          {
            icon: 'question',
            fieldName: 'details.spoc.testing.name',
            description: '',
            title: 'Name of the Testing SPOC',
            type: 'textbox',
            required: true,
            validationError: 'Please provide name of testing SPOC'
          },
          {
            icon: 'question',
            fieldName: 'details.spoc.testing.email',
            description: '',
            title: 'Email of the Testing SPOC',
            type: 'textbox',
            // required is not needed if we specifiy validations
            // required: true,
            validations: 'isRequired,isEmail',
            validationErrors: {
              isRequired : 'Please provide email of testing SPOC',
              isEmail  : 'Please enter a valid email'
            }
          },
          {
            icon: 'question',
            fieldName: 'details.spoc.dev.name',
            description: '',
            title: 'Name of the development SPOC',
            type: 'textbox',
            required: true,
            validationError: 'Please provide name of development SPOC'
          },
          {
            icon: 'question',
            fieldName: 'details.spoc.dev.email',
            description: '',
            title: 'Email of the development SPOC',
            type: 'textbox',
            // required is not needed if we specifiy validations
            // required: true,
            validations: 'isRequired,isEmail',
            validationErrors: {
              isRequired : 'Please provide email of development SPOC',
              isEmail  : 'Please enter a valid email'
            }
          }
        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Critical business processes for inclusion in Performance Test',
        description: 'Please detail any critical business processes \
                       such as peak hour user load, transaction count in peak hours, \
                       SLA (in seconds).',
        type: 'notes'
      }
    ]
  }
]
