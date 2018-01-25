import { Icons } from 'appirio-tech-react-components'
// import NumberText from '../../components/NumberText/NumberText'
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
            validationError: 'Please let us know what kind of application you would like to test.',
            title: 'What kind of application would you like to test?',
            description: 'Please let us know the type of application to test. If you are unsure, please select "Other"',
            fieldName: 'details.appDefinition.mobilityTestingType',
            type: 'select-dropdown',
            options: [
              { value: '', title: 'Select' },
              { value: 'finserv', title: 'Banking or Financial Services' },
              { value: 'ecommerce', title: 'eCommerce' },
              { value: 'entertainment', title: 'Media / Entertainment' },
              { value: 'gaming', title: 'Gaming' },
              { value: 'health', title: 'Health and Fitness' },
              { value: 'manufacturing', title: 'Manufacturing' },
              { value: 'retail', title: 'Retail' },
              { value: 'travel', title: 'Travel / Transportation' },
              { value: 'other', title: 'Other' }
            ]
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please let us know if you have test cases.',
            title: 'Do you have test cases written?',
            description: 'Please let us know if you have any test cases written. If not, they can be created as part of your test cycle.',
            fieldName: 'details.appDefinition.testCases',
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
            description: 'Please describe your application.',
            title: '',
            type: 'textbox'
          },
          {
            icon: 'question',
            id: 'targetApplication.platform',
            fieldName: 'details.targetApplication.platform',
            description: 'Please list all platforms the application should be tested on.',
            title: '',
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
            description: 'Would you like usability suggestions included in the issue report?',
            title: '',
            type: 'textbox'
          },
          {
            icon: 'question',
            id: 'preferences.omissions',
            fieldName: 'details.cyclePreferences.omissions',
            description: 'Are there any types of defects you would like ommitted from issue reports?',
            title: '',
            type: 'textbox'
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
            validationError: 'Please let us know what kind of application you would like to test.',
            title: 'What kind of application would you like to test?',
            description: 'Please let us know the type of application to test. If you are unsure, please select "Other"',
            fieldName: 'details.appDefinition.mobilityTestingType',
            type: 'select-dropdown',
            options: [
              { value: '', title: 'Select' },
              { value: 'finserv', title: 'Banking or Financial Services' },
              { value: 'ecommerce', title: 'eCommerce' },
              { value: 'entertainment', title: 'Media / Entertainment' },
              { value: 'gaming', title: 'Gaming' },
              { value: 'health', title: 'Health and Fitness' },
              { value: 'manufacturing', title: 'Manufacturing' },
              { value: 'retail', title: 'Retail' },
              { value: 'travel', title: 'Travel / Transportation' },
              { value: 'other', title: 'Other' }
            ]
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please let us know if you have test cases.',
            title: 'Do you have test cases written?',
            description: 'Please let us know if you have any test cases written. If not, they can be created as part of your test cycle.',
            fieldName: 'details.appDefinition.testCases',
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
              {value: 'dontKnow', title: 'Do not know', iconOptions: { filePath: 'icon-dont-know',  fill: '#00000'}, desc: 'We will find the best fit for you.'}
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
