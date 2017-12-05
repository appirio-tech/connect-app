import _ from 'lodash'
// import NumberText from '../../components/NumberText/NumberText'
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
        description: 'Topcoder will scan your application using our properiatary formula\
        for security standards. To rate your application we combine state of the art \
        static code analysis, security scanning, export code review and other techniques \
        to produce a Security Health Check scorecard.',
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
            description: 'Topcoder will scan your application using our properiatary formula\
             for security standards. To rate your application we combine state of the art \
             static code analysis, security scanning, export code review and other techniques \
             to produce a Security Health Check scorecard.',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'How secure is your application?',
            description: '(this helps default values for the testing)',
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
            title: 'Do you wish to baseline your application against the Topcoder Security Standard',
            description: '',
            fieldName: 'details.security.baselineBool',
            type: 'radio-group',
            options: [
              {value: 'topcoder', label: 'Topcoder'},
              {value: 'custom', label: 'Custom'}
            ],
            required: true,
            validationError: 'Please select one'
          },
          {
            icon: 'question',
            title: 'If you chose other, please detail your baseline testing standard',
            description: '(if applicable)',
            type: 'textbox',
            fieldName: 'details.security.baselineOther',
            required: false,
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
            type: 'radio-group',
            options: [
              {value: 'topcoder', label: 'Topcoder'},
              {value: 'custom', label: 'Custom'}
            ],
            required: true,
            validationError: 'Please select one'
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
        title: 'Project Name',
        description: 'Topcoder will scan your application using our properiatary formula\
        for security standards. To rate your application we combine state of the art \
        static code analysis, security scanning, export code review and other techniques \
        to produce a Security Health Check scorecard.',
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
              description: 'Brief describe your application',
              title: 'Description',
              type: 'textbox'
            },
            {
              icon: 'question',
              title: 'How secure is your application?',
              description: '(this helps default values for the testing)',
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
              title: 'Do you wish to baseline your application against the Topcoder Security Standard',
              description: '',
              fieldName: 'details.security.baselineBool',
              type: 'radio-group',
              options: [
                {value: 'topcoder', label: 'Topcoder'},
                {value: 'custom', label: 'Custom'}
              ],
              required: true,
              validationError: 'Please select one'
            },
            {
              icon: 'question',
              title: 'If you chose other, please detail your baseline testing standard',
              description: '(if applicable)',
              type: 'textbox',
              fieldName: 'details.security.baselineOther',
              required: false,
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
  }


]
