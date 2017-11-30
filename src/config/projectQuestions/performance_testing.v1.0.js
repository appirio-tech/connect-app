import _ from 'lodash'
import NumberText from '../../components/NumberText/NumberText'
import { findProduct } from '../projectWizard'


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
            id: 'targetApplication.appName',
            fieldName: 'details.targetApplication.appName',
            title: 'Please enter the name of the application being tested',
            description: 'Name of the application to be tested',
            type: 'textbox',
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
              isRequired: 'Please provide a description',
              minLength: 'Please enter at least 160 characters'
            },
            description: 'Brief Description',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'Expected load on the platform exercised during Performance Test? ',
            description: '',
            fieldName: 'details.testingNeeds.expectedLoad',
            type: 'tiled-radio-group',
            options: [
              { value: '60%', title: '% load', icon: NumberText, iconOptions: { number: '60' }, desc: 'endurance testing', price: 7000 },
              { value: '100%', title: '% load', icon: NumberText, iconOptions: { number: '100' }, desc: 'load testing', price: 5000 },
              { value: '120%', title: '% load', icon: NumberText, iconOptions: { number: '120' }, desc: 'stress testing', price: 7000 }
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
              { value: 'scenario', label: 'Scenario Booster add 3 more ($1,000)' },
              { value: '250vusers', label: 'Add 250 vUsers ($1,000)' },
              { value: '2500vusers', label: 'Add 2500 vUsers ($4,000)' },
              { value: 'geo', label: 'Add additional Geography($1,500)' },
              { value: 'poc', label: 'Precurser to purchase - 1 Tool, 2 scripts,1 hour execution ($2,500)' },
              { value: 'strategy', label: 'Utilize consultant to tailor strategy ($3,000)' },
              { value: 'execution', label: 'Execution Booster extra 2 hours ($500)' },
              { value: 'mytool', label: 'Use my own testing tool ($2,500)' },
              { value: 'myscripts', label: 'Modify/Use own scripts ($5,000)' },
              { value: 'late', label: 'Late Entry - 1 week lead time ($2,000)' }
            ],
            fieldName: 'details.testingNeeds.addons'
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
    id: 'pocs',
    required: false,
    title: 'Points of Contacts',
    description: 'Please provide information on specific points of contacts.',
    subSections: [
      {
        id: 'scope',
        required: false,
        title: 'SPOCs',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'question',
            fieldName: 'details.spoc.business.name',
            description: '',
            title: 'Name of the Business SPOC',
            type: 'textbox',
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
            validations: 'isEmail',
            validationErrors: {
              isEmail: 'Please enter a valid email'
            }
          },
          {
            icon: 'question',
            fieldName: 'details.spoc.testing.name',
            description: '',
            title: 'Name of the Testing SPOC',
            type: 'textbox',
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
            validations: 'isEmail',
            validationErrors: {
              isEmail: 'Please enter a valid email'
            }
          },
          {
            icon: 'question',
            fieldName: 'details.spoc.dev.name',
            description: '',
            title: 'Name of the development SPOC',
            type: 'textbox',
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
            validations: 'isEmail',
            validationErrors: {
              isEmail: 'Please enter a valid email'
            }
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
  },
  {
    id: 'perfTestEnv',
    title: 'Performance Test Environment',
    description: 'Please provide information on test environments.',
    subSections: [
      {
        id: 'perfTestEnvSec',
        title: 'Details',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.simulators',
            description: '',
            title: 'Are the simulators/stubs available in test enviornemnt for the components not avaiable and do they support concurrent request simulation?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.vendors',
            description: '',
            title: 'Will online interfaces/stubs for the payment systems, vendor systems etc. be available for performance testing?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.vendors',
            description: '',
            title: 'Please provide details on test data availability? A) Resident or master test data in DB e.g. Customers, products, locations etc. B) User specific data e.g. User Ids, email, credit card, order number etc. Who will support creating/importing/ masking test data',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.soa',
            description: '',
            title: 'Please let us know if SOA based services needs to be performance tested stand alone. If yes, please provide relevant details',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.cloud',
            description: '',
            title: 'Are the applications hosted on physical servers or virtual/cloud infrastructure?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.tools',
            description: '',
            title: 'Are performance testing tools available with your organisation. e.g. HP Loadrunner, \
                  Performance Center, Jmeter. If yes, is PoC conducted to validate compatibility of tools \
                  with application under test.  Will these be tools be made available in with required \
                  license for Perfomance testing in scope?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.diagnosticTools',
            description: '',
            title: 'Are performance Diagnostic tools available with your organisation. e.g. Dynatrace, Yourkit, \
                 Profiler, If yes, is PoC conducted to validate compatibility of tools with application under \
test.  Will these be tools be made available in with required license for Perfomance testing \
in scope?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.monitoring',
            description: '',
            title: 'How is application performance being monitored or planned to be monitored in production. Are same tools available in Perf Test env?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.saasTools',
            description: '',
            title: 'In case of Cloud based or SaaS performance testing tools, will your organisation allow to open necessary ports in firewall to inject load on to application in test environment.',
            type: 'textbox'
          }
        ]
      }
    ]
  },
  {
    id: 'previousDetails',
    title: 'Previous Performance Test Details',
    description: 'Please provide information on specific points of contacts.',
    subSections: [
      {
        id: 'prevDetails',
        title: 'Details',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'question',
            fieldName: 'details.prevDetails.time',
            description: '',
            title: 'When was the last time performance testing carried out. On which version of application code base?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.prevDetails.reports',
            description: '',
            title: 'Please share the previous performance test reports if available',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.prevDetails.changes',
            description: '',
            title: 'What are the changes in application, architecture, infrastructure from last testing?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.prevDetails.types',
            description: '',
            title: 'What different types of tests carried out and measurements captured?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.prevDetails.tools',
            description: '',
            title: 'What were the performance testing and performance monitoring tools used?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.prevDetails.issues',
            description: '',
            title: 'Were there any open performance issues from previous testing?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.prevDetails.fixedIssues',
            description: '',
            title: 'What were the issues found and fixed during previous performance testing cycle?',
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
              isRequired: 'Please provide a description',
              minLength: 'Please enter at least 160 characters'
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
              { value: 'load', label: 'Load' },
              { value: 'stress', label: 'Stress' },
              { value: 'endurance', label: 'Endurance' },
              { value: 'other', label: 'Other' }
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
              { value: '100%', title: '% load', icon: NumberText, iconOptions: { number: '100' }, desc: 'load testing', price: 5000 },
              { value: '120%', title: '% load', icon: NumberText, iconOptions: { number: '120' }, desc: 'stress testing', price: 7000 },
              { value: '60%', title: '% load', icon: NumberText, iconOptions: { number: '60' }, desc: 'endurance testing', price: 7000 }
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
              { value: 'scenario', label: 'Scenario Booster add 3 more ($1,000)' },
              { value: '250vusers', label: 'Add 250 vUsers ($1,000)' },
              { value: '2500vusers', label: 'Add 2500 vUsers ($4,000)' },
              { value: 'geo', label: 'Add additional Geography($1,500)' },
              { value: 'poc', label: 'Precurser to purchase - 1 Tool, 2 scripts,1 hour execution ($2,500)' },
              { value: 'strategy', label: 'Utilize consultant to tailor strategy ($3,000)' },
              { value: 'execution', label: 'Execution Booster extra 2 hours ($500)' },
              { value: 'mytool', label: 'Use my own testing tool ($2,500)' },
              { value: 'myscripts', label: 'Modify/Use own scripts ($5,000)' },
              { value: 'late', label: 'Late Entry - 1 week lead time ($2,000)' }
            ],
            fieldName: 'details.testingNeeds.addons'
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
