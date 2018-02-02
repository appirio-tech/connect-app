import get from 'lodash/get'
import identity from 'lodash/identity'
// import NumberText from '../../components/NumberText/NumberText'
import { findProduct } from '../projectWizard'


const isFileRequired = (project, subSections) => {
  const subSection = _.find(subSections, (s) => s.type === 'questions')
  const fields = _.filter(subSection.questions, q => q.type.indexOf('see-attached') > -1)
  // iterate over all seeAttached type fields to check
  //  if any see attached is checked.
  return fields
    .map(field => get(project, `${field.fieldName}.seeAttached`))
    .some(identity)
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
            fieldName: 'details.vision.groundtruthDesc',
            required: true,
            validationError: 'Please tell us about your ground truth'
          },
          {
            icon: 'question',
            title: 'Describe your data set',
            description: '(if applicable)',
            type: 'textbox',
            fieldName: 'details.vision.dataDesc',
            required: true,
            validationError: 'Please tell us about your data set'
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
            title: 'Approximately how many images are in your data set?',
            description: '',
            type: 'textbox',
            fieldName: 'details.vision.imageSet',
            required: true,
            validationError: 'Please tell us roughly the number of images in your set'
          }

        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Additional Notes',
        description: 'Please detail any other additional information',
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
  },
  {
    id: 'optionals',
    required: false,
    title: 'Additional Questions',
    description: 'Please complete these optional questions.',
    subSections: [
      {
        id: 'additional',
        required: false,
        title: 'Additional Questions',
        description: '',
        type: 'questions',
        questions: [
          {
            icon: 'question',
            fieldName: 'details.dataURL',
            description: '',
            title: 'Please provide a URL to your data',
            type: 'textbox'

          },
          {
            icon: 'question',
            fieldName: 'details.performanceInfo',
            description: '',
            title: 'Please describe the performance of your existing software',
            type: 'textbox'

          },
          {
            icon: 'question',
            fieldName: 'details.externalDataUsage',
            description: '',
            title: 'Do you anticipate allowing contestants to use external data?',
            type: 'radio-group',
            options: [
              {value: 'Yes', label: 'Yes'},
              {value: 'No', label: 'No'},
              {value: 'Unsure', label: 'Unsure'}
            ]
          },
          {
            icon: 'question',
            fieldName: 'details.externalDataUsage',
            description: '',
            title: 'If you have already thought of a scoring method, please indicate them here',
            type: 'checkbox-group',
            options: [
              {value: 'F1/Dice', label: 'F1/Dice'},
              {value: 'Jaccard Index', label: 'Jaccard Index'},
              {value: 'Harmonic Mean', label: 'Harmonic Mean'}
            ]
          },
          {
            icon: 'question',
            fieldName: 'details.otherScoringInfo',
            description: '',
            title: 'If scoring method was other, please provide your approach',
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
            fieldName: 'details.vision.groundtruthDesc',
            required: true,
            validationError: 'Please tell us about your ground truth'
          },
          {
            icon: 'question',
            title: 'Describe your data set',
            description: '(if applicable)',
            type: 'textbox',
            fieldName: 'details.vision.dataDesc',
            required: true,
            validationError: 'Please tell us about your data set'
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
            title: 'Approximately how many images are in your data set?',
            description: '',
            type: 'textbox',
            fieldName: 'details.vision.imageSet',
            required: true,
            validationError: 'Please tell us roughly the number of images in your set'
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
