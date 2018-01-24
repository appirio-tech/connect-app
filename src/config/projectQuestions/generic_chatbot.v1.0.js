import _ from 'lodash'
// import { Icons } from 'appirio-tech-react-components'
import { isFileRequired, findTitle } from '../projectWizard'

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
            fieldName: 'description',
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
            title: 'What capabilities does the chatbot need to support?',
            description: '',
            type: 'checkbox-group',
            fieldName: 'details.appDefinition.capabilities',
            options: [
              {value: 'order_management', label: 'Order Management'},
              {value: 'information', label: 'Information'},
              {value: 'help', label: 'Help'},
              {value: 'complaints', label: 'Complaints'},
              {value: 'billing', label: 'Billing'},
              {value: 'account_management', label: 'Account Management'},
              {value: 'custom', label: 'Custom (please explain in the Notes)'}
            ]
          },
          {
            icon: 'question',
            title: 'Will the chatbot need to access data from any systems to support the capabilities you listed above? If so, please list the systems below.',
            description: '',
            type: 'textbox',
            fieldName: 'details.appDefinition.integrationSystems'
          },
          {
            icon: 'question',
            title: 'Do you have any example agent conversations you can provide? If so, please paste them or any links to documents below (you’ll be able to upload documents later).',
            description: '',
            type: 'textbox',
            fieldName: 'details.appDefinition.existingAgentScripts'
          },
          {
            icon: 'question',
            title: 'Are you planning to transfer conversations to human agents? If so, please list the agents’ communication tools (e.g., Slack, LiveAgent, Intercom, etc.).',
            description: '',
            type: 'textbox',
            fieldName: 'details.appDefinition.transferToHumanAgents'
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
            required: true,
            validationError: 'Please complete this section',
            title: 'What capabilities does the chatbot need to support?',
            description: '',
            type: 'checkbox-group',
            fieldName: 'details.appDefinition.capabilities',
            options: [
              {value: 'order_management', label: 'Order management'},
              {value: 'information', label: 'Information'},
              {value: 'help', label: 'Help'},
              {value: 'complaints', label: 'Complaints'},
              {value: 'billing', label: 'Billing'},
              {value: 'account_management', label: 'Account management'},
              {value: 'custom', label: 'Custom (please explain in the Notes)'}
            ]
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please complete this section',
            title: 'Will the chatbot need to access data from any systems to support the capabilities you listed above? If so, please list the systems below.',
            description: '',
            type: 'textbox',
            fieldName: 'details.appDefinition.integrationSystems'
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please complete this section',
            title: 'Do you have any example agent conversations you can provide? If so, please paste them or any links to documents below (you’ll be able to upload documents later).',
            description: '',
            type: 'textbox',
            fieldName: 'details.appDefinition.existingAgentScripts'
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please complete this section',
            title: 'Are you planning to transfer conversations to human agents? If so, please list the agents’ communication tools (e.g., Slack, LiveAgent, Intercom, etc.).',
            description: '',
            type: 'textbox',
            fieldName: 'details.appDefinition.transferToHumanAgents'
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
