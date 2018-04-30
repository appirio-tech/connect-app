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
            id: 'projectInfo',
            // required is not needed if we specifiy validations
            required: true,
            validations: 'isRequired,minLength:160',
            validationErrors: {
              isRequired : 'Please provide a description',
              minLength  : 'Please enter at least 160 characters'
            },
            fieldName: 'description',
            description: 'Can you provide a brief summary of the application you’d like to develop?',
            title: 'App Summary',
            type: 'textbox'
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please let us know the target device',
            title: 'App Type',
            description: 'What type of application are we developing? Please \
                          place an X in the Required column for each required app \
                          type. Please note that each additional app type incurs \
                          a cost, but that the cost will be detailed and broken \
                          out in the final project proposal. ',
            fieldName: 'details.appDefinition.appType',
            type: 'checkbox-group',
            options: [
              { value: 'ios', label: 'iOS App - An app built for iPhone or iPads' },
              { value: 'android', label: 'Android App - An app built for mobile phones or tablets running Android.' },
              { value: 'hybrid', label: 'Hybrid App - An app built using a hybrid framework (ex. Ionic/Cordova/Xamarin) and exported to one or more operating systems (iOS, Android or both).' },
              { value: 'web', label: 'Mobile Web App - An app that is accessed by using a mobile web browser like Safari or Chrome.' }
            ]
          },
          {
            // required is not needed if we specifiy validations
            // required: true,
            fieldName: 'details.appDefinition.workflow',
            description: 'Please describe the ideal workflow for the proposed solution.',
            title: 'Workflow',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,
            fieldName: 'details.appDefinition.objectives',
            description: 'What are the main business objectives you want to achieve by developing this application?',
            title: 'Objectives',
            type: 'textbox'
          },
          {
            icon: 'question',
            validationError: 'Please let us know the form factor required',
            title: 'App Type',
            description: 'Please place an X in the Required column for each form \
                         factor/orientation that must be supported.',
            fieldName: 'details.appDefinition.formFactor',
            type: 'checkbox-group',
            options: [
              { value: 'mobile-portrait', label: 'Mobile - Portrait' },
              { value: 'mobile-landscape', label: 'Mobile - Landscape' },
              { value: 'tablet-portrait', label: 'Tablet - Portrait' },
              { value: 'tablet-landscape', label: 'Tablet - Landscape' }
            ]
          },
          {
            icon: 'question',
            description: 'How much budget do you have? Please place an X in the Confirm column to specify your budget.',

            title: 'Budget',
            fieldName: 'details.loadDetails.budget',
            type: 'slide-radiogroup',
            options: [
              { value: 'upto-25', title: 'Under $25K '},
              { value: 'upto-50', title: '$25K to $50K' },
              { value: 'upto-75', title: '$50K to $75K' },
              { value: 'upto-100', title: '$75K to $100K' },
              { value: 'above-100', title: 'More than $100K' }
            ],
            required: true,
            validationError: 'Please provide expected hours of execution'
          },
          {
            icon: 'question',
            description: 'When do you need your app by? Please place an X in the Confirm column to specify your timeline.',
            title: 'Timeline',
            fieldName: 'details.loadDetails.timeline',
            type: 'slide-radiogroup',
            options: [
              { value: 'upto-1month', title: 'Under 1 month'},
              { value: 'upto-2months', title: '1 to 2 months' },
              { value: 'upto-3months', title: '2 to 3 months' },
              { value: 'upto-6months', title: '3 to 6 months' }
            ],
            required: true,
            validationError: 'Please provide expected hours of execution'
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
        required: false,
        hideTitle: false,
        title: 'User Roles',
        description: 'Please place an X in the Required column for each user type/role. Please provide details on what the user/role should do in the Description column.',
        questions: [
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.userRoles.standard',
            title: 'Standard User',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.userRoles.admin',
            title: 'Admin',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.userRoles.superAdmin',
            title: 'Super Admin',
            type: 'textbox'
          }
        ]
      },
      {
        required: false,
        hideTitle: false,
        title: 'Integrations',
        description: 'Will this application be dependant on data from another system or tool? If yes, please briefly describe that dependency here.  This can include integration with an API or an existing backend/database.',
        type: 'questions',
        questions: [
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.integrations.api',
            title: 'API',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.integrations.backend',
            title: 'Backend',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.integrations.database',
            title: 'Database',
            type: 'textbox'
          }
        ]
      },
      {
        id: 'techStack',
        required: false,
        hideTitle: false,
        title: 'Technology Stack',
        description: 'Do you have a preferred technology stack? If yes, please list those requirements here:',
        type: 'questions',
        questions: [
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.techstack.languages',
            title: 'Programming Languages',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.techstack.frameworks',
            title: 'Frameworks',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.techstack.Database',
            title: 'Database',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.techstack.server',
            title: 'Server',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.techstack.hosting',
            title: 'Hosting Environment',
            type: 'textbox'
          }
        ]
      },
      {
        required: false,
        hideTitle: false,
        title: 'Style Guide & Brand Guidelines',
        description: '',
        type: 'questions',
        questions: [
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.designGuidelines.Styleguide',
            title: 'Do you have a style guide or branding guidelines that need to be followed?',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.designGuidelines.fonts',
            title: 'Are there any particular fonts you want used?',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.designGuidelines.colors',
            title: 'Are there any particular colors/themes you want used?',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.designGuidelines.appIcon',
            title: 'Do you need an app icon designed, or will you provide one?',
            type: 'textbox'
          }
        ]
      },

      {
        hideTitle: true,
        title: 'Quality Assurance, Testing and Security',
        description: '',
        type: 'questions',
        questions: [
          {
            fieldName: 'details.qaTesting.security',
            type: 'checkbox-group',
            options: [
              { value: 'standard', label: 'Standard Security' },
              { value: 'enterprise', label: 'Enterprise - if your application will house\
                   or transmit PII or sensitive data. The data will be encrypted on the device and the server.' },
              { value: 'vulnerability', label: 'Vulnerability Scanning - Scan your application for weaknesses' },
              { value: 'auditing', label: 'Audit - Auditing will record user information on actions performed.' },
              { value: 'confidential', label: 'System will be working with confidential, health or financial records'}
            ],
            description: 'Please place an X in the Required column for each required security requirement.',
          },
          {
            icon: 'question',
            title: 'Quality Assurance, Test Data & Performance Testing',
            description: 'Please place an X in the Required column for each required QA requirement.',
            fieldName: 'details.qaTesting.testing',
            type: 'checkbox-group',
            options: [
              { value: 'rw-unstructured', label: 'Real World Unstructured - Users search on their own for bugs or usability issues.' },
              { value: 'rw-structured', label: 'Structured Functional - execution of predefined test scripts' },
              { value: 'testcases', label: 'Test Case Creation - creation of scenarios, instructions and exepected results' },
              { value: 'certification', label: 'Certify your mobile application release against predefined device set including.' },
              { value: 'devicelab', label: 'Test real devices in real cell networks across the world' },
              { value: 'performanceTuning', label: 'Identify and provide perfromance improvements' },
              { value: 'performanceTesting', label: 'Testing web application robustness' },
            ]
          },
          {
            icon: 'question',
            title: 'How many users do you intend to support?',
            type: 'textbox',
            fieldName: 'details.qaTesting.users',
            required: false
          },
          {
            icon: 'question',
            title: 'Do you intend to supply test data or should Topcoder create it?',
            fieldName: 'details.qaTesting.data',
            type: 'slide-radiogroup',
            options: [
              { value: 'create', title: 'We will provide obfuscated data'},
              { value: 'provide', title: 'Topcoder will create data' }
            ],
            required: false
          },
          {
            icon: 'question',
            title: 'User Acceptance / Beta Testing',
            description: 'UAT is the process of sharing the final application with users and gathering feedback. Please place an X in the Required column for each required UAT requirement.',
            fieldName: 'details.qaTesting.uat',
            type: 'checkbox-group',
            options: [
              { value: 'uat', label: '1 UAT/Beta Test Cycle.' },
              { value: 'uat-updates', label: 'Implementation of Updates (update the app based on UAT/Beta Testing feedback)' },
            ]
          }

        ]
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
        id: 'user',
        required: true,
        hideTitle: true,
        title: 'Questions',
        description: '',
        type: 'questions',
        questions: [
          {
            id: 'projectInfo',
            // required is not needed if we specifiy validations
            required: true,
            validations: 'isRequired,minLength:160',
            validationErrors: {
              isRequired : 'Please provide a description',
              minLength  : 'Please enter at least 160 characters'
            },
            fieldName: 'description',
            description: 'Can you provide a brief summary of the application you’d like to develop?',
            title: 'App Summary',
            type: 'textbox'
          },
  /*        {
            icon: 'question',
            title: 'Feature requirements',
            description: 'Please list all the features you would like in your application. You can use our wizard to pick from common features or define your own.',
            type: 'see-attached-features',
            fieldName: 'details.appDefinition.features'
          },
          */
          {
            icon: 'question',
            required: true,
            validationError: 'Please let us know the target device',
            title: 'App Type',
            description: 'What type of application are we developing? Please \
                          place an X in the Required column for each required app \
                          type. Please note that each additional app type incurs \
                          a cost, but that the cost will be detailed and broken \
                          out in the final project proposal. ',
            fieldName: 'details.appDefinition.appType',
            type: 'checkbox-group',
            options: [
              { value: 'ios', label: 'iOS App - An app built for iPhone or iPads' },
              { value: 'android', label: 'Android App - An app built for mobile phones or tablets running Android.' },
              { value: 'hybrid', label: 'Hybrid App - An app built using a hybrid framework (ex. Ionic/Cordova/Xamarin) and exported to one or more operating systems (iOS, Android or both).' },
              { value: 'web', label: 'Mobile Web App - An app that is accessed by using a mobile web browser like Safari or Chrome.' }
            ]
          },
          {
            // required is not needed if we specifiy validations
            // required: true,
            fieldName: 'details.appDefinition.workflow',
            description: 'Please describe the ideal workflow for the proposed solution.',
            title: 'Workflow',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,
            fieldName: 'details.appDefinition.objectives',
            description: 'What are the main business objectives you want to achieve by developing this application?',
            title: 'Objectives',
            type: 'textbox'
          },

          {
            icon: 'question',
            description: 'How much budget do you have? Please place an X in the Confirm column to specify your budget.',

            title: 'Budget',
            fieldName: 'details.loadDetails.budget',
            type: 'slide-radiogroup',
            options: [
              { value: 'upto-25', title: 'Under $25K '},
              { value: 'upto-50', title: '$25K to $50K' },
              { value: 'upto-75', title: '$50K to $75K' },
              { value: 'upto-100', title: '$75K to $100K' },
              { value: 'above-100', title: 'More than $100K' }
            ],
            required: true,
            validationError: 'Please provide expected hours of execution'
          },
          {
            icon: 'question',
            description: 'When do you need your app by? Please place an X in the Confirm column to specify your timeline.',
            title: 'Timeline',
            fieldName: 'details.loadDetails.timeline',
            type: 'slide-radiogroup',
            options: [
              { value: 'upto-1month', title: 'Under 1 month'},
              { value: 'upto-2months', title: '1 to 2 months' },
              { value: 'upto-3months', title: '2 to 3 months' },
              { value: 'upto-6months', title: '3 to 6 months' }
            ],
            required: true,
            validationError: 'Please provide expected hours of execution'
          }

        ]
      },
      {
        required: false,
        hideTitle: false,
        title: 'User Roles',
        description: 'Please place an X in the Required column for each user type/role. Please provide details on what the user/role should do in the Description column.',
        questions: [
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.userRoles.standard',
            title: 'Standard User',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.userRoles.admin',
            title: 'Admin',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.userRoles.superAdmin',
            title: 'Super Admin',
            type: 'textbox'
          }
        ]
      },
      {
        required: false,
        hideTitle: false,
        title: 'Integrations',
        description: 'Will this application be dependant on data from another system or tool? If yes, please briefly describe that dependency here.  This can include integration with an API or an existing backend/database.',
        type: 'questions',
        questions: [
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.integrations.api',
            title: 'API',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.integrations.backend',
            title: 'Backend',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.integrations.database',
            title: 'Database',
            type: 'textbox'
          }
        ]
      },
      {
        id: 'techStack',
        required: false,
        hideTitle: false,
        title: 'Technology Stack',
        description: 'Do you have a preferred technology stack? If yes, please list those requirements here:',
        type: 'questions',
        questions: [
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.techstack.languages',
            title: 'Programming Languages',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.techstack.frameworks',
            title: 'Frameworks',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.techstack.Database',
            title: 'Database',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.techstack.server',
            title: 'Server',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.techstack.hosting',
            title: 'Hosting Environment',
            type: 'textbox'
          }
        ]
      },
      {
        required: false,
        hideTitle: false,
        title: 'Style Guide & Brand Guidelines',
        description: '',
        type: 'questions',
        questions: [
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.designGuidelines.Styleguide',
            title: 'Do you have a style guide or branding guidelines that need to be followed?',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.designGuidelines.fonts',
            title: 'Are there any particular fonts you want used?',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.designGuidelines.colors',
            title: 'Are there any particular colors/themes you want used?',
            type: 'textbox'
          },
          {
            // required is not needed if we specifiy validations
            // required: true,

            fieldName: 'details.designGuidelines.appIcon',
            title: 'Do you need an app icon designed, or will you provide one?',
            type: 'textbox'
          }
        ]
      },

      {
        hideTitle: true,
        title: 'Quality Assurance, Testing and Security',
        description: '',
        type: 'questions',
        questions: [
          {
            fieldName: 'details.qaTesting.security',
            title: 'Security Requirements',
            type: 'checkbox-group',
            options: [
              { value: 'standard', label: 'Standard Security' },
              { value: 'enterprise', label: 'Enterprise - if your application will house\
                   or transmit PII or sensitive data. The data will be encrypted on the device and the server.' },
              { value: 'vulnerability', label: 'Vulnerability Scanning - Scan your application for weaknesses' },
              { value: 'auditing', label: 'Audit - Auditing will record user information on actions performed.' },
              { value: 'confidential', label: 'System will be working with confidential, health or financial records'}
            ],
            description: 'Please place an X in the Required column for each required security requirement.',
          },
          {
            icon: 'question',
            title: 'Quality Assurance, Test Data & Performance Testing',
            description: 'Please place an X in the Required column for each required QA requirement.',
            fieldName: 'details.qaTesting.testing',
            type: 'checkbox-group',
            options: [
              { value: 'rw-unstructured', label: 'Real World Unstructured - Users search on their own for bugs or usability issues.' },
              { value: 'rw-structured', label: 'Structured Functional - execution of predefined test scripts' },
              { value: 'testcases', label: 'Test Case Creation - creation of scenarios, instructions and exepected results' },
              { value: 'certification', label: 'Certify your mobile application release against predefined device set including.' },
              { value: 'devicelab', label: 'Test real devices in real cell networks across the world' },
              { value: 'performanceTuning', label: 'Identify and provide perfromance improvements' },
              { value: 'performanceTesting', label: 'Testing web application robustness' },
            ]
          },
          {
            icon: 'question',
            title: 'How many users do you intend to support?',
            type: 'textbox',
            fieldName: 'details.qaTesting.users',
            required: false
          },
          {
            icon: 'question',
            title: 'Do you intend to supply test data or should Topcoder create it?',
            fieldName: 'details.qaTesting.data',
            type: 'slide-radiogroup',
            options: [
              { value: 'create', title: 'We will provide obfuscated data'},
              { value: 'provide', title: 'Topcoder will create data' }
            ],
            required: false
          },
          {
            icon: 'question',
            title: 'User Acceptance / Beta Testing',
            description: 'UAT is the process of sharing the final application with users and gathering feedback. Please place an X in the Required column for each required UAT requirement.',
            fieldName: 'details.qaTesting.uat',
            type: 'checkbox-group',
            options: [
              { value: 'uat', label: '1 UAT/Beta Test Cycle.' },
              { value: 'uat-updates', label: 'Implementation of Updates (update the app based on UAT/Beta Testing feedback)' },
            ]
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
