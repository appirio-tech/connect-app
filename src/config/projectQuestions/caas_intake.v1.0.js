// import NumberText from '../../components/NumberText/NumberText'
import { isFileRequired, findTitle, findFilesSectionTitle } from '../projectWizard'

const sections = [
  {
    id: 'appDefinition',
    title: findTitle,
    required: true,
    description: 'Welcome to your own private Gig Crowd',
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
        description: 'Topcoder will scan your application using our properiatary formula\
        for security standards. To rate your application we combine state of the art \
        static code analysis, security scanning, export code review and other techniques \
        to produce a Security Health Check scorecard.',
        type: 'questions',
        questions: [
          {
            id: 'projectInfo',
            fieldName: 'description',
            // required is not needed if we specifiy validations
            // required: true,
            validations: 'isRequired,minLength:160',
            validationErrors: {
              isRequired: 'Please describe your application.',
              minLength: 'Please enter at least 160 characters'
            },
            description: 'Please describe your application.',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'What is the maximum level of acceptable risk for this application?',
            description: 'Based on the features and data, how secure do you feel this application should be?',
            fieldName: 'details.security.howSecure',
            type: 'slide-radiogroup',
            options: [
              { value: 'low-risk', title: 'Low Risk'},
              { value: 'medium-risk', title: 'Medium Risk' },
              { value: 'high-risk', title: 'High Risk' },
              { value: 'custom', title: 'Custom' }
            ],
            required: true,
            validationError: 'Please select security rating'
          },
          {
            icon: 'question',
            title: 'Do you require additional documentation for workers?',
            description: '',
            fieldName: 'details.caas.docs',
            type: 'radio-group',
            options: [
              {value: 'topcoder', label: 'Topcoder NDA'},
              {value: 'custom', label: 'Custom NDA'},
              {value: 'custom', label: 'Background Check'},
              {value: 'custom', label: 'Other'}
            ]
          },
          {
            icon: 'question',
            title: 'If you chose other, please detail your baseline testing standard',
            description: '(if applicable)',
            type: 'textbox',
            fieldName: 'details.security.baselineOther',
            required: false
          }

        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Additional Notes',
        description: 'Please detail any other additional information.  After \
        completing this form, you\'ll be able to add additional information about \
        your code base',
        type: 'notes'
      }


    ]
  },
  {
    id: 'optionals',
    required: false,
    title: 'Code base',
    description: 'Please provide us access to your codebase below or contact \
    Topcoder through your dashboard.',
    subSections: [
      {
        id: 'additional',
        required: false,
        title: 'Codebase questions',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'question',
            fieldName: 'details.security.codeURL',
            description: '(if you prefer you can also upload your code below)',
            title: 'Please provide a URL to your code base repository',
            type: 'textbox'

          },
          {
            icon: 'question',
            title: 'Please provide Topcoder with any additional information about \
            accessing your code base',
            description: '',
            fieldName: 'details.security.additionalInfo',
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
    description: 'Create your own private Gig Workforce with Topcoder by answering \
        a few simple questions',
    subSections: [
      {
        id: 'projectName',
        required: true,
        validationError: 'Please provide a name to your project',
        fieldName: 'name',
        title: 'Project Name',
        description: '',
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
              isRequired: 'Please describe your application.',
              minLength: 'Please enter at least 160 characters'
            },
            description: 'Brief describe your application',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'How many full time resources do you need?',
            description: '',
            fieldName: 'details.resources.total',
            type: 'textbox',
            required: true,
            validationError: 'Please enter number of resources'
          },
          {
            icon: 'question',
            title: 'How many months do you need the resource for',
            description: '',
            fieldName: 'details.resources.months',
            type: 'slide-radiogroup',
            options: [
              {value: '1', title: '1'},
              {value: '2', title: '2'},
              {value: '3', title: '3'},
              {value: '4', title: '4'},
              {value: '5', title: '5'},
              {value: '6', title: '6'},
              {value: '7', title: '7'},
              {value: '8', title: '8'},
              {value: '9', title: '9'},
              {value: '10', title: '10'},
              {value: '11', title: '11'},
              {value: '12', title: '12'}
            ],
            required: true,
            validationError: 'Please select one'
          },
          {
            icon: 'question',
            title: 'What skills do you need?',
            description: '',
            fieldName: 'details.resources.skills',
            type: 'checkbox-group',
            options: [
              { value: 'ios', label:'iOS' },
              { value: 'data-sci', label:'Data Science' },
              { value: 'android', label:'Android' },
              { value: 'java', label:'java' },
              { value: 'dotnet', label:'.NET' },
              { value: 'node', label:'NodeJS' },
              { value: 'javascript', label:'Javascript' },
              { value: 'react', label:'ReactJS' },
              { value: 'angular', label:'AngularJS' }
            ]
          },
          {
            icon: 'question',
            title: 'What is the typical hourly rate you are paying?',
            description: '',
            fieldName: 'details.resources.hourlyrate',
            type: 'slide-radiogroup',
            options: [
              { value: 'under30', title:'Under $30' },
              { value: 'under60', title:'Under $60' },
              { value: 'under80', title:'Under $80' },
              { value: 'under100', title:'Under $100' },
              { value: 'under125', title:'Under $125' },
              { value: 'under150', title:'Under $150' },
              { value: 'over150', title:'Over $150' },
            ]
          },
          {
            icon: 'question',
            title: 'What language would you like to interact with the team?',
            description: '',
            fieldName: 'details.resources.hourlyrate',
            type: 'slide-radiogroup',
            options: [
              { value: 'english', title:'English' },
              { value: 'spanish', title:'Spanish' },
              { value: 'german', title:'German' },
              { value: 'japanese', title:'Japanese' },
              { value: 'other', title:'Other' }
            ]
          },
          {
            fieldName: 'details.resources.tooling',
            // required is not needed if we specifiy validations
            // required: true,
            description: 'Please List all project tools you normally interact with',
            title: 'Project Tools you utilize for interacting with developers',
            type: 'textbox'
          },
        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Additional Notes',
        description: 'Please detail any other additional information.  After \
          completing this form, you\'ll be able to add additional information about \
          your code base',
        type: 'notes'
      }

    ]
  }


]
