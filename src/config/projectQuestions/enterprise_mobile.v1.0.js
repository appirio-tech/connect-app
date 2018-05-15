import React from 'react' // eslint-disable-line no-unused-vars

const sections = [
  {
    id: 'appDefinition',
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
            title: 'Form Factor/Orientation',
            description: 'Please place an X in the Required column for each  \
                          form factor/orientation that must be supported.',
            fieldName: 'details.appDefinition.formFactor',
            type: 'checkbox-group',
            options: [
              { value: 'mobile-phone-portrait', label: 'Mobile Phone - Portrait' },
              { value: 'mobile-phone-landscape', label: 'Mobile Phone - Landscape' },
              { value: 'tablet-device-portrait', label: 'Tablet Device - Portrait'},
              { value: 'tablet-device-landscape', label: 'Tablet Device - Landscape' }
            ]
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
        required: false,
        hideTitle: false,
        title: 'User Roles',
        type: 'questions',
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
        id: 'screen-features',
        required: false,
        hideTitle: false,
        title: 'Screen and Features',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'question',
            title: 'Screen / Feature List',
            description: 'Please note that each added feature incurs a cost, \
                         but that the cost will be detailed and broken out in the \
                         final project proposal.  ',
            fieldName: 'details.appDefinition.screens',
            type: 'checkbox-group',
            options: [
              { value: 'enterprise-login', label:'Enterprise Login - Supports integration with an existing authorization/authentication mechanism.'},
              { value: 'email-login', label:'Email Login - Support sign in using an email address/password.'},
              { value: 'social-login', label:'Social Login - Support register and login using third-party services such as Facebook, Twitter, and Google.'},
              { value: 'registration', label:'Registration - Allow users to register and login using their email address and a password. Users can also change their password or recover a forgotten one.'},
              { value: 'invitations', label:'Invitations - Allow users to invite others to use your app via email. '},
              { value: 'introductions', label:'Introductions - Present your app and inform users of core functionality using a series of introductory screens before they sign up.'},
              { value: 'onboarding', label:'Onboarding - Virtually walk your users through your application. This functionality is especially useful if you need new users to set up an account or express preferences after they sign up.'},
              { value: 'search', label:'Search - Provide the ability to search your app for specific content, such as products, members, or locations. Please specify below if you also would like autocomplete--suggesting appropriate search terms as a user starts typing.'},
              { value: 'location-based-services', label:'Location Based Services - App must support the identification of the users geographic location for location based features. Ex. show store locations on a map or illustrating the progress of a delivery.'},
              { value: 'camera', label:'Camera (Audio & Video) - Add this feature if your app will require using the camera to capture audio or video.'},
              { value: 'file-upload', label:'File Upload - Allow users to upload photos or other files.'},
              { value: 'notifications', label:'Notifications - Take advantage of notifications; for example, remind users to do certain tasks or update them on new content.'},
              { value: 'dashboard', label:'Dashboard - App must have a central dashboard where users can access functionality'},
              { value: 'tagging', label:'Tagging - Allow users to tag products, people or content; for example, in order to classify and easily retrieve notes.'},
              { value: 'account-settings', label:'Account Settings - Allow your users to adjust settings or specify preferences, such as communication frequency.'},
              { value: 'help-faws', label:'Help/FAQs - Include a section dedicated to FAQ or Help content.'},
              { value: 'marketplace', label:'Marketplace - Allow users to buy, sell, or rent products or services.'},
              { value: 'ratings-reviews', label:'Ratings & Reviews - Let users rate or review people, products, or services.'},
              { value: 'payments', label:'Payments - Allow users to pay in some way; for example, using credit cards, PayPal, or Bitcoin.'},
              { value: 'shopping-cart', label:'Shopping Cart - Allow users to save items before purchasing. Please specify your desired functionality below.'},
              { value: 'product-listing', label:'Product Listing - Add this feature to shows lists of product or services, with individual detail pages for each one.'},
              { value: 'activity-feed', label:'Activity Feed - Show your users an activity feed of some kind, as they’re used to seeing on Facebook and Twitter, for example.'},
              { value: 'profiles', label:'Profiles - Add this feature if your app requires users to have a profile, including the ability to edit it.'},
              { value: 'messaging', label:'Messaging - Allow direct communication between two or more users.'},
              { value: 'admin-tool', label:'Admin Tool - App must have an administrative tool or panel to enable direct management of users, content and the application.'},
              { value: 'social-media-integration', label:'Social Media Integration - App must integrate with social media providers (Facebook, Instagram, Twitter, Google+, etc)'},
              { value: 'reporting', label:'Reporting - App must have the ability to report/export data'},
              { value: 'contact-us', label:'Contact Us - App must have the ability to allow users to contact an administrator/send feedback to administrators.'},
              { value: '3d-touch', label:'3D Touch - If this is an iOS App -- should the designers make use of 3D Touch?'}
            ]
          },

          {
            icon: 'question',
            title: 'Tech Features',
            description: '',
            fieldName: 'details.appDefinition.techFeatures',
            type: 'checkbox-group',
            options: [
              { value: 'enterprise-login', label:'SSO Integration - App must integrate with enterprise single-sign-on capability.'},
              { value: 'api-integration', label:'API Integration - App must integrate with a pre-existing API.'},
              { value: 'third-party-system-integration', label:'Third Party System Integration - App must integrate with an external application or system and either retrieve or post data.'},
              { value: 'containerized-code', label:'Containerized Code - The codebase must be containerized via Docker to allow for easier deployment and maintenance.'},
              { value: 'unit-tests', label:'Unit Tests - App must have unit tests to ensure code coverage.'},
              { value: 'continuous-integration-/-continuous-deployment', label:'Continuous Integration / Continuous Deployment - Establishment of a CI/CD pipeline.'},
              { value: 'analytics-implementation', label:'Analytics Implementation - Implementation of analytics to track user behavior and app usage.'},
              { value: 'email-(smtp-server)-setup', label:'Email (SMTP Server) Setup - Development and configuration of an SMTP server to provide email notifications. Design, content and development of the emails will need to be handled separately.'},
              { value: 'offline-capability', label:'Offline Capability - Ability to use features of the application offline, and have the data persist/saved locally and then sent back to a server for syncing.'},
              { value: 'camera', label:'Minimal Battery Usage Implementation - Update to the core features of a mobile application to support the ability to minimize usage of network bandwidth and battery usage.'},
              { value: 'apple-app-store-&-google-play-submission-support', label:'Apple App Store & Google Play Submission Support - Consulting support to help streamline the app publishing process to Apple App Store or Google Play.'},
              { value: 'sms-gateway-integration', label:'SMS Gateway Integration - App must integrate with an external SMS gateway/provider for notifications via SMS.'},
              { value: 'error-logging', label:'Error Logging - Does the application need error logging (this will log all errors, exceptions, warnings, debug information during the application execution and will be helpful to rectify the issues)?'},
              { value: 'faceid-touchid', label:'Face ID / Touch ID -- If this is an iOS App -- should we support Face ID/Touch ID for login'}
            ]
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
              { value: 'uat-updates', label: 'Implementation of Updates (update the app based on UAT/Beta Testing feedback)' }
            ]
          },
        ]


      },
      {
        hideTitle: false,
        title: 'Budget and Timeline',
        description: '',
        type: 'questions',
        questions: [
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
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Notes',
        description: 'Add any other important information regarding your project (e.g., links to documents or existing applications)',
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
            title: 'Form Factor/Orientation',
            description: 'Please place an X in the Required column for each  \
                          form factor/orientation that must be supported.',
            fieldName: 'details.appDefinition.formFactor',
            type: 'checkbox-group',
            options: [
              { value: 'mobile-phone-portrait', label: 'Mobile Phone - Portrait' },
              { value: 'mobile-phone-landscape', label: 'Mobile Phone - Landscape' },
              { value: 'tablet-device-portrait', label: 'Tablet Device - Portrait'},
              { value: 'tablet-device-landscape', label: 'Tablet Device - Landscape' }
            ]
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
        required: false,
        hideTitle: false,
        title: 'User Roles',
        type: 'questions',
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
        id: 'screen-features',
        required: false,
        hideTitle: false,
        title: 'Screen and Features',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'question',
            title: 'Screen / Feature List',
            description: 'Please note that each added feature incurs a cost, \
                         but that the cost will be detailed and broken out in the \
                         final project proposal.  ',
            fieldName: 'details.appDefinition.screens',
            type: 'checkbox-group',
            options: [
              { value: 'enterprise-login', label:'Enterprise Login - Supports integration with an existing authorization/authentication mechanism.'},
              { value: 'email-login', label:'Email Login - Support sign in using an email address/password.'},
              { value: 'social-login', label:'Social Login - Support register and login using third-party services such as Facebook, Twitter, and Google.'},
              { value: 'registration', label:'Registration - Allow users to register and login using their email address and a password. Users can also change their password or recover a forgotten one.'},
              { value: 'invitations', label:'Invitations - Allow users to invite others to use your app via email. '},
              { value: 'introductions', label:'Introductions - Present your app and inform users of core functionality using a series of introductory screens before they sign up.'},
              { value: 'onboarding', label:'Onboarding - Virtually walk your users through your application. This functionality is especially useful if you need new users to set up an account or express preferences after they sign up.'},
              { value: 'search', label:'Search - Provide the ability to search your app for specific content, such as products, members, or locations. Please specify below if you also would like autocomplete--suggesting appropriate search terms as a user starts typing.'},
              { value: 'location-based-services', label:'Location Based Services - App must support the identification of the users geographic location for location based features. Ex. show store locations on a map or illustrating the progress of a delivery.'},
              { value: 'camera', label:'Camera (Audio & Video) - Add this feature if your app will require using the camera to capture audio or video.'},
              { value: 'file-upload', label:'File Upload - Allow users to upload photos or other files.'},
              { value: 'notifications', label:'Notifications - Take advantage of notifications; for example, remind users to do certain tasks or update them on new content.'},
              { value: 'dashboard', label:'Dashboard - App must have a central dashboard where users can access functionality'},
              { value: 'tagging', label:'Tagging - Allow users to tag products, people or content; for example, in order to classify and easily retrieve notes.'},
              { value: 'account-settings', label:'Account Settings - Allow your users to adjust settings or specify preferences, such as communication frequency.'},
              { value: 'help-faws', label:'Help/FAQs - Include a section dedicated to FAQ or Help content.'},
              { value: 'marketplace', label:'Marketplace - Allow users to buy, sell, or rent products or services.'},
              { value: 'ratings-reviews', label:'Ratings & Reviews - Let users rate or review people, products, or services.'},
              { value: 'payments', label:'Payments - Allow users to pay in some way; for example, using credit cards, PayPal, or Bitcoin.'},
              { value: 'shopping-cart', label:'Shopping Cart - Allow users to save items before purchasing. Please specify your desired functionality below.'},
              { value: 'product-listing', label:'Product Listing - Add this feature to shows lists of product or services, with individual detail pages for each one.'},
              { value: 'activity-feed', label:'Activity Feed - Show your users an activity feed of some kind, as they’re used to seeing on Facebook and Twitter, for example.'},
              { value: 'profiles', label:'Profiles - Add this feature if your app requires users to have a profile, including the ability to edit it.'},
              { value: 'messaging', label:'Messaging - Allow direct communication between two or more users.'},
              { value: 'admin-tool', label:'Admin Tool - App must have an administrative tool or panel to enable direct management of users, content and the application.'},
              { value: 'social-media-integration', label:'Social Media Integration - App must integrate with social media providers (Facebook, Instagram, Twitter, Google+, etc)'},
              { value: 'reporting', label:'Reporting - App must have the ability to report/export data'},
              { value: 'contact-us', label:'Contact Us - App must have the ability to allow users to contact an administrator/send feedback to administrators.'},
              { value: '3d-touch', label:'3D Touch - If this is an iOS App -- should the designers make use of 3D Touch?'}
            ]
          },

          {
            icon: 'question',
            title: 'Tech Features',
            description: '',
            fieldName: 'details.appDefinition.techFeatures',
            type: 'checkbox-group',
            options: [
              { value: 'enterprise-login', label:'SSO Integration - App must integrate with enterprise single-sign-on capability.'},
              { value: 'api-integration', label:'API Integration - App must integrate with a pre-existing API.'},
              { value: 'third-party-system-integration', label:'Third Party System Integration - App must integrate with an external application or system and either retrieve or post data.'},
              { value: 'containerized-code', label:'Containerized Code - The codebase must be containerized via Docker to allow for easier deployment and maintenance.'},
              { value: 'unit-tests', label:'Unit Tests - App must have unit tests to ensure code coverage.'},
              { value: 'continuous-integration-/-continuous-deployment', label:'Continuous Integration / Continuous Deployment - Establishment of a CI/CD pipeline.'},
              { value: 'analytics-implementation', label:'Analytics Implementation - Implementation of analytics to track user behavior and app usage.'},
              { value: 'email-(smtp-server)-setup', label:'Email (SMTP Server) Setup - Development and configuration of an SMTP server to provide email notifications. Design, content and development of the emails will need to be handled separately.'},
              { value: 'offline-capability', label:'Offline Capability - Ability to use features of the application offline, and have the data persist/saved locally and then sent back to a server for syncing.'},
              { value: 'camera', label:'Minimal Battery Usage Implementation - Update to the core features of a mobile application to support the ability to minimize usage of network bandwidth and battery usage.'},
              { value: 'apple-app-store-&-google-play-submission-support', label:'Apple App Store & Google Play Submission Support - Consulting support to help streamline the app publishing process to Apple App Store or Google Play.'},
              { value: 'sms-gateway-integration', label:'SMS Gateway Integration - App must integrate with an external SMS gateway/provider for notifications via SMS.'},
              { value: 'error-logging', label:'Error Logging - Does the application need error logging (this will log all errors, exceptions, warnings, debug information during the application execution and will be helpful to rectify the issues)?'},
              { value: 'faceid-touchid', label:'Face ID / Touch ID -- If this is an iOS App -- should we support Face ID/Touch ID for login'}
            ]
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
              { value: 'uat-updates', label: 'Implementation of Updates (update the app based on UAT/Beta Testing feedback)' }
            ]
          },
        ]


      },
      {
        hideTitle: false,
        title: 'Budget and Timeline',
        description: '',
        type: 'questions',
        questions: [
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
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Notes',
        description: 'Add any other important information regarding your project (e.g., links to documents or existing applications)',
        type: 'notes'
      }
    ]
  }
]
