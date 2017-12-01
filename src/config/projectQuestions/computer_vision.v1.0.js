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
            id: 'projectInfo',
            fieldName: 'description',
            // required is not needed if we specifiy validations
            // required: true,
            validations: 'isRequired,minLength:160',
            validationErrors: {
              isRequired: 'Please provide your objectives',
              minLength: 'Please enter at least 160 characters'
            },
            description: 'Brief Description of your objectives',
            title: 'Objectives',
            type: 'textbox'
          }

        ]
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
              isRequired: 'Please provide your objectives',
              minLength: 'Please enter at least 160 characters'
            },
            description: 'Brief Description of your objectives',
            title: 'Objectives',
            type: 'textbox'
          },

          {
            icon: 'question',
            title: 'Do you have ground truth defined?',
            description: '',

            fieldName: 'details.vision.groundtruth',
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
            title: 'Describe your ground truth?',
            description: '(if applicable)',
            type: 'textbox',
            fieldName: 'details.vision.groundtruthDesc'
          },
          {
            icon: 'question',
            title: 'Describe your data set',
            description: '(if applicable)',
            type: 'textbox',
            fieldName: 'details.vision.dataDesc'
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
