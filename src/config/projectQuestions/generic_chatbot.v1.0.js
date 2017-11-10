import _ from 'lodash'
// import { Icons } from 'appirio-tech-react-components'
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
          },
          {
            icon: 'question',
            fieldName: 'details.appDefinition.budget',
            description: 'Project budget in USD, please enter 0 if you don\'t have one',
            title: 'What is your project budget?',
            type: 'numberinput'
          },
          {
            icon: 'question',
            title: 'How precise is your budget?',
            // description: 'Please let us know if you have any budget in mind.',
            fieldName: 'details.appDefinition.budgetType',
            type: 'slide-radiogroup',
            options: [
              {value: 'guess', title: 'Its a wild guess'},
              {value: 'ballpark', title: 'I have a rough idea'},
              {value: 'exact', title: 'Precise to the penny'}
            ]
          },
          {
            icon: 'question',
            title: 'When do you want to get started?',
            // description: 'Please let us know if you have any budget in mind.',
            fieldName: 'details.appDefinition.whenToStart',
            type: 'slide-radiogroup',
            options: [
              {value: 'asap', title: 'ASAP'},
              {value: '1-2 months', title: '1-2 months'},
              {value: '2-plus-months', title: '2+ months'},
              {value: 'estimating', title: 'I\'m just browsing' }
            ]
          },
          {
            icon: 'question',
            fieldName: 'details.appDefinition.deadline',
            // description: 'What is your project deadline?',
            title: 'Deadline',
            type: 'slide-radiogroup',
            options: [
              {value: '2-weeks', title: '2 weeks'},
              {value: '1-2-months', title: '1-2 months'},
              {value: '2-plus-months', title: '2+ months'},
              {value: 'estimating', title: 'I\'m just browsing'}
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
            required: true,
            fieldName: 'description',
            validationError: 'Please provide a description',
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
