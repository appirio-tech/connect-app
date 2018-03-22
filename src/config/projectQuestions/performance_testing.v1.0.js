// import NumberText from '../../components/NumberText/NumberText'
import { isFileRequired, findTitle, findFilesSectionTitle } from '../projectWizard'

const sections = [
  {
    id: 'appDefinition',
    title: findTitle,
    required: true,
    description: 'Please answer a few basic questions about your project. You can also provide the needed information in a supporting document—add a link in the notes section or upload it below.',
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
            id: 'projectInfo',
            fieldName: 'description',
            // required is not needed if we specifiy validations
            // required: true,
            validations: 'isRequired,minLength:160',
            validationErrors: {
              isRequired: 'Please provide a description',
              minLength: 'Please enter at least 160 characters'
            },
            description: 'In 160 or more characters tell us what is the app, main functions, problem area, etc..',
            title: 'Please provide brief description of the system and/or application you would like to execute Performance Testing on.',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'What is the desired load on the system in terms of concurrent users for this test?',
            description: '(Unit package includes 500 virtual users, additional load would require Top-Ups)',
            type: 'slide-radiogroup',
            options: [
              { value: 'upto-500', title: 'Up to 500' },
              { value: 'upto-1000', title: 'Up to 1000' },
              { value: 'upto-5000', title: 'Up to 5000' },
              { value: 'above-5000', title: 'More than 5000' }
            ],
            fieldName: 'details.loadDetails.concurrentUsersCount',
            required: true,
            validationError: 'Please provide expected load'
          },
          {
            icon: 'question',
            title: 'Approximately how many business processes/transactions will be included in your Performance Test?',
            description: '(Unit package covers 10 transactions, additional transactions would require Top-Ups)',
            fieldName: 'details.loadDetails.businessProcessesCount',
            type: 'slide-radiogroup',
            options: [
              { value: 'upto-5', title: 'Up to 5'},
              { value: 'upto-10', title: 'Up to 10' },
              { value: 'upto-25', title: 'Up to 25' },
              { value: 'above-25', title: 'More than 25' }
            ],
            required: true,
            validationError: 'Please provide expected number of business processes'
          },
          {
            icon: 'question',
            title: 'How many hours do you expect the Performance Test to be executed for?',
            description: '(Unit package covers 10 hours of execution, additional execution time would require Top-Ups)',
            fieldName: 'details.loadDetails.expectedExecutionHours',
            type: 'slide-radiogroup',
            options: [
              { value: 'upto-5', title: 'Up to 5'},
              { value: 'upto-10', title: 'Up to 10' },
              { value: 'upto-25', title: 'Up to 25' },
              { value: 'above-25', title: 'More than 25' }
            ],
            required: true,
            validationError: 'Please provide expected hours of execution'
          },
          {
            icon: 'question',
            title: 'Please select any additional add-ons.',
            description: '',
            type: 'checkbox-group',
            options: [
              { value: 'scenario', label: 'Scenario Booster add 3 more' },
              { value: '250vusers', label: 'Add 250 vUsers' },
              { value: '2500vusers', label: 'Add 2500 vUsers' },
              { value: 'geo', label: 'Add additional Geography' },
              { value: 'poc', label: 'Precurser to purchase - 1 Tool, 2 scripts,1 hour execution' },
              { value: 'strategy', label: 'Utilize consultant to tailor strategy' },
              { value: 'execution', label: 'Execution Booster extra 2 hours' },
              { value: 'mytool', label: 'Use my own testing tool' },
              { value: 'myscripts', label: 'Modify/Use own scripts' },
              { value: 'late', label: 'Late Entry - 1 week lead time' }
            ],
            required: false,
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
    id: 'pocs',
    required: false,
    title: 'Points of Contacts',
    description: 'Please provide information on specific points of contacts.',
    subSections: [
      {
        id: 'spoc',
        required: false,
        title: 'SPOCs (Single Point of Contact)',
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
      }
    ]
  },
  {
    id: 'systemOverview',
    title: 'System Overview',
    required: false,
    description: 'Please provide the overview of the system to be tested',
    subSections: [
      {
        id: 'questions',
        // required: true,
        hideTitle: true,
        title: 'Questions',
        description: '',
        type: 'questions',
        questions: [
          {
            id: 'architecture',
            // required: true,
            // validationError: 'Please provide architecture details of the applciation',
            fieldName: 'details.targetApplication.architecture',
            description: '',
            title: 'Briefly describe the architecture of the system. Please attach any architecture diagrams, design documents, and non-functional requirements in the Files section of this page.',
            type: 'textbox'
          },
          {
            id: 'developmentPlatform',
            icon: 'question',
            title: 'What is the application development platform?',
            description: '',
            type: 'checkbox-group',
            options: [
              { value: 'dotnet', label: '.NET' },
              { value: 'j2ee', label: 'J2EE' },
              { value: 'ria', label: 'Rich Internet Applications' },
              { value: 'oracle', label: 'Oracle Technology' },
              { value: 'sap', label: 'SAP' },
              { value: 'mainframe', label: 'Mainframe' },
              { value: 'adobe-flex', label: 'Adobe Flex' },
              { value: 'others', label: 'Others' }
            ],
            fieldName: 'details.targetApplication.developmentPlatform'
            // required: true,
            // validationError: 'Please provide development platform of the application'
          },
          {
            id: 'frontEnd',
            icon: 'question',
            title: 'What is the front end of the system?',
            description: '',
            fieldName: 'details.targetApplication.frontEnd',
            type: 'checkbox-group',
            options: [
              { value: 'web-browser', label: 'Web Browser - Thin Client'},
              { value: 'desktop-app', label: 'Desktop App (Executable) - Thick Client' },
              { value: 'citrix', label: 'Citrix based Desktop App (Executable)' },
              { value: 'java', label: 'Java based (with Swing/Applets)' },
              { value: 'oracle-forms', label: 'Web based Oracle Forms' },
              { value: 'other', label: 'Any other' }
            ]
            // required: true,
            // validationError: 'Please provide front end used in the application'
          },
          {
            icon: 'question',
            title: 'If applicable what web servers are used?',
            description: '(For eg. Webserver can be Apache, IIS etc.)',
            fieldName: 'details.targetApplication.webBrowsers',
            type: 'textbox'
            // required: true,
            // validationError: 'Please provide target web browsers'
          },
          {
            icon: 'question',
            title: 'If applicable what application servers are used?',
            description: '(For eg. Application server can be JBoss or Weblogic or Websphere etc.)',
            fieldName: 'details.targetApplication.appServers',
            type: 'textbox'
            // required: true,
            // validationError: 'Please provide application servers used'
          },
          {
            icon: 'question',
            title: 'What data store technology is used?',
            description: '(For eg. Back end can be Oracle, MS SQL or Sybase etc)',
            fieldName: 'details.targetApplication.backEnd',
            type: 'textbox'
            // required: true,
            // validationError: 'Please provide back end used in the application'
          },
          {
            icon: 'question',
            title: 'If the back end is a legacy system then specify the below',
            description: 'Mainframe(S390), AS400, Others',
            fieldName: 'details.targetApplication.legacyBackEnd',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'What middleware is used, if any?',
            description: '(For eg. Middleware can be MQSeries or TIBCO or Webmethod etc)',
            fieldName: 'details.targetApplication.middleware',
            type: 'textbox'
            // required: true,
            // validationError: 'Please provide middleware used in the application'
          },
          {
            icon: 'question',
            title: 'If your system uses web services, what architecture do they use? What functions do your web services perform?',
            description: '(For eg. SOAP/REST Webservices deployed in App server for new customer creation and maintenance)',
            fieldName: 'details.targetApplication.webservices',
            type: 'textbox'
            // required: true,
            // validationError: 'Please provide web services used in the application'
          },
          {
            id: 'targetApplication.authMode',
            icon: 'question',
            title: 'What is the authentication mode used by the application?',
            description: '',
            fieldName: 'details.targetApplication.authMode',
            type: 'checkbox-group',
            options: [
              { value: 'ntlm', label: 'NTLM'},
              { value: 'sso', label: 'Siteminder/SSO' },
              { value: 'ldap', label: 'LDAP' },
              { value: 'others', label: 'Others' }
            ]
            // required: true,
            // validationError: 'Please provide authentication mode of the application'
          },
          {
            id: 'targetApplication.interfaces',
            icon: 'question',
            title: 'What interfaces does the application have?',
            description: '',
            fieldName: 'details.targetApplication.interfaces',
            type: 'checkbox-group',
            options: [
              { value: 'vendor-system', label: 'Vendor System'},
              { value: 'document-mgmt-system', label: 'Document Mgmt System' },
              { value: 'payments', label: 'Payments' },
              { value: 'other', label: 'Others' }
            ]
            // required: true,
            // validationError: 'Please provide interfaces used in the application'
          }
        ]
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
        title: 'Questions',
        hideTitle: true,
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.missingCompSimulators',
            description: '',
            title: 'Are the simulators/stubs available in test environment for the components available and if so do they support concurrent request simulation?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.thirdPartyStubs',
            description: '',
            title: 'Will online interfaces/stubs for the payment systems, vendor systems etc. be available for performance testing?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.testDataAvailability',
            description: '',
            title: 'Please provide details on test data availability - \
                    A) Resident or master test data in DB e.g. Customers, products, locations etc.\
                    B) User specific data e.g. User Ids, email, credit card, order number etc.\
                    Who will support creating/importing/masking test data?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.soa',
            description: '',
            title: 'Please let us know if SOA based services need to be performance tested in a stand alone manner. If yes, please provide relevant details',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.hostedOn',
            description: 'Are the applications hosted on physical servers or virtual/cloud infrastructure',
            title: 'Where are applications hosted?',
            type: 'radio-group',
            options: [
              {value: 'physical-servers', label: 'Physical servers'},
              {value: 'cloud', label: 'Virtual/Cloud infrastructure'}
            ]
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.tools',
            description: '',
            title: 'Are performance testing tools available within your organization? \
                    (e.g. HP Loadrunner, Performance Center, Jmeter) If yes, has a PoC \
                    been conducted to validate the compatibility of these tools with the \
                    application to be tested? Will these be tools be made available in with \
                    required license for this performance test?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.diagnosticTools',
            description: '',
            title: 'Are performance diagnostic tools available within your organization? \
            (e.g. Dynatrace, Yourkit, Profiler) If yes, has a PoC been conducted to validate \
            compatibility ofthese tools with the applicationto be tested? Will these be tools \
            be made available in with required license for this performance test?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.monitoring',
            description: '',
            title: 'How is application performance being monitored or planned to be monitored in production.\
            Are same tools available in testing environment?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.perfTestEnv.saasAllowPortsOpening',
            description: '',
            title: 'In case of cloud based or SaaS performance testing tools, will your organization open necessary \
                    ports in any firewalls required to inject load on the application in a test environment?',
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
        title: 'Questions',
        hideTitle: true,
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'question',
            fieldName: 'details.prevDetails.time',
            description: '',
            title: 'When was the last time performance test carried out? On which version of application code base?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.prevDetails.reports',
            description: '',
            title: 'Please share the previous performance test reports if available by pasting here, or attaching in the Files section.',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.prevDetails.changes',
            description: '',
            title: 'What are the changes in application, architecture, infrastructure since the last test?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.prevDetails.typesOfTests',
            description: '',
            title: 'What different types of tests were carried out and which measurements were captured?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.prevDetails.monitoringTools',
            description: '',
            title: 'What were the performance testing and performance monitoring tools used?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.prevDetails.testScripts',
            description: '',
            title: 'Are the performance test scenarios and automated test scripts previously used still available?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.prevDetails.issues',
            description: '',
            title: 'Are there any open performance issues from previous tests?',
            type: 'textbox'
          },
          {
            icon: 'question',
            fieldName: 'details.prevDetails.fixedIssues',
            description: '',
            title: 'Please detail any issues previously identified and resolved from previous performance tests.',
            type: 'textbox'
          }
        ]
      }
    ]
  }
]

export default sections

// This is where the project creation form lives

export const basicSections = [
  {
    id: 'appDefinition',
    title: '',
    required: true,
    description: 'Please answer a few basic questions about your project. If you have any supporting documents, please add the links in the “Notes” section. You can upload any additional files (specifications, diagrams, mock interfaces, etc.) once your project is created.',
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
            id: 'projectInfo',
            fieldName: 'description',
            // required is not needed if we specifiy validations
            // required: true,
            validations: 'isRequired,minLength:160',
            validationErrors: {
              isRequired: 'Please provide a description',
              minLength: 'Please enter at least 160 characters'
            },
            description: 'In 160 or more characters tell us what is the app, main functions, problem area, etc..',
            title: 'Please provide brief description of the system and/or application you would like to execute Performance Testing on.',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'What is the desired load on the system in terms of concurrent users for this test??',
            description: '(Unit package includes 500 virtual users, additional load would require Top-Ups)',
            type: 'slide-radiogroup',
            options: [
              { value: 'upto-500', title: 'Up to 500' },
              { value: 'upto-1000', title: 'Up to 1000' },
              { value: 'upto-5000', title: 'Up to 5000' },
              { value: 'above-5000', title: 'More than 5000' }
            ],
            fieldName: 'details.loadDetails.concurrentUsersCount',
            required: true,
            validationError: 'Please provide expected load'
          },
          {
            icon: 'question',
            title: 'Approximately how many business processes/transactions will be included in your Performance Test?',
            description: '(Unit package covers 10 transactions, additional transactions would require Top-Ups)',
            fieldName: 'details.loadDetails.businessProcessesCount',
            type: 'slide-radiogroup',
            options: [
              { value: 'upto-5', title: 'Up to 5'},
              { value: 'upto-10', title: 'Up to 10' },
              { value: 'upto-25', title: 'Up to 25' },
              { value: 'above-25', title: 'More than 25' }
            ],
            required: true,
            validationError: 'Please provide expected number of business processes'
          },
          {
            icon: 'question',
            title: 'How many hours do you expect the Performance Test to be executed for?',
            description: '(Unit package covers 10 hours of execution, additional execution time would require Top-Ups)',
            fieldName: 'details.loadDetails.expectedExecutionHours',
            type: 'slide-radiogroup',
            options: [
              { value: 'upto-5', title: 'Up to 5'},
              { value: 'upto-10', title: 'Up to 10' },
              { value: 'upto-25', title: 'Up to 25' },
              { value: 'above-25', title: 'More than 25' }
            ],
            required: true,
            validationError: 'Please provide expected hours of execution'
          }
        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Notes',
        description: 'Please enter any additional information like requirements,\
                       architecture details, tools, performance baseline, etc.\
                       After creating your project you will be able to upload files.',
        type: 'notes'
      }
    ]
  }
]
