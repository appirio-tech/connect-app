import _ from 'lodash'
// import NumberText from '../../components/NumberText/NumberText'
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
              isRequired: 'Please provide an overview of your project',
              minLength: 'Please enter at least 160 characters'
            },
            description: 'Brief provide an overview of your project',
            title: 'Objectives',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'Describe what you would like to learn or accomplish with this data?',
            description: '',
            type: 'textbox',
            fieldName: 'details.data.learnings'
          },
          {
            icon: 'question',
            title: 'Describe your data set',
            description: '',
            type: 'textbox',
            fieldName: 'details.vision.dataDesc',
            required: true,
            validationError: 'Please tell us about your data set'
          },
          {
            icon: 'question',
            title: 'Approximately how many records are in your data set?',
            description: '',
            type: 'textbox',
            fieldName: 'details.data.records',
            required: true,
            validationError: 'Please tell us roughly the number of records in your set'
          },
          {
            icon: 'question',
            title: 'Approximately how large is your data set in MB, GB, TB?',
            description: '',
            type: 'textbox',
            fieldName: 'details.vision.datasetSize',
            required: true,
            validationError: 'Please tell us the size of your data set'
          },

          {
            icon: 'question',
            title: 'Does your data need to be obfuscated?',
            description: '(if applicable)',
            fieldName: 'details.data.obfuscation',
            type: 'radio-group',
            options: [
              {value: 'true', label: 'Yes'},
              {value: 'false', label: 'No'}
            ],
            required: true,
            validationError: 'Please select one'
          },
          {
            icon: 'question',
            fieldName: 'details.dataURL',
            description: 'Or provide us a sample of your data by uploading an example below',
            title: 'Please provide a URL to your data ',
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
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Additional Notes',
        description: 'Please detail any other additional information',
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
              isRequired: 'Please provide an overview of your project',
              minLength: 'Please enter at least 160 characters'
            },
            description: 'Brief provide an overview of your project',
            title: 'Objectives',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'Describe what you would like to learn or accomplish with this data?',
            description: '',
            type: 'textbox',
            fieldName: 'details.data.learnings'
          },
          {
            icon: 'question',
            title: 'Describe your data set',
            description: '',
            type: 'textbox',
            fieldName: 'details.vision.dataDesc',
            required: true,
            validationError: 'Please tell us about your data set'
          },
          {
            icon: 'question',
            title: 'Approximately how many records are in your data set?',
            description: '',
            type: 'textbox',
            fieldName: 'details.data.records',
            required: true,
            validationError: 'Please tell us roughly the number of records in your set'
          },
          {
            icon: 'question',
            title: 'Approximately how large is your data set in MB, GB, TB?',
            description: '',
            type: 'textbox',
            fieldName: 'details.vision.datasetSize',
            required: true,
            validationError: 'Please tell us the size of your data set'
          },

          {
            icon: 'question',
            title: 'Does your data need to be obfuscated?',
            description: '(if applicable)',
            fieldName: 'details.data.obfuscation',
            type: 'radio-group',
            options: [
              {value: 'true', label: 'Yes'},
              {value: 'false', label: 'No'}
            ],
            required: true,
            validationError: 'Please select one'
          }



        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Additional Notes',
        description: 'Please detail any other additional information',
        type: 'notes'
      }
    ]
  }


]
