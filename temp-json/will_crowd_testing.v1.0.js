import _ from 'lodash'
import { Icons } from 'appirio-tech-react-components'
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
        if (prd) return prd
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
            icon: 'question',
            title: 'Approximately how many hours of crowd testing are you looking for?',
            description: 'If you know roughly the amount of time you want spent testing the application please list it here. If you do not know how many hours you require your copilot can assist you.',
            fieldName: 'details.appDefinition.testingHours',
            type: 'tiled-radio-group',
            options: [
              {value: 'upTo100', title: 'Up to 100', icon: Icons.IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'upTo250', title: 'Up to 250', icon: Icons.IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'upTo500', title: 'Up to 500', icon: Icons.IconTechOutlineDesktop, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'doNotKnow', title: 'Do not know', icon: Icons.IconTechOutlineWatchApple, iconOptions: { fill: '#00000'}, desc: ''}
            ]
          },
          {
            id: 'projectInfo',
            required: true,
            fieldName: 'description',
            description: 'Please describe your business needs.',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'In what geographies would you like to test?',
            description: 'Please select the regions from which you would like testers to participate.',
            type: 'checkbox-group',
            options: [
              {value: 'africa', label: 'Africa'},
              {value: 'asia', label: 'Asia'},
              {value: 'australia', label: 'Australia'},
              {value: 'europe', label: 'Europe'},
              {value: 'northAmerica', label: 'North America'},
              {value: 'southAmerica', label: 'South America'}
            ],
            fieldName: 'details.appDefinition.testingGeographies'
          },
          {
            icon: 'question',
            title: 'Approximately how many hours of crowd testing are you looking for?',
            description: 'If you know roughly the amount of time you want spent testing the application please list it here. If you do not know how many hours you require your copilot can assist you.',
            fieldName: 'details.appDefinition.primaryTarget',
            type: 'tiled-radio-group',
            options: [
              {value: 'upTo5', title: 'Up to 5', icon: Icons.IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'upTo10', title: 'Up to 10', icon: Icons.IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'upTo20', title: 'Up to 20', icon: Icons.IconTechOutlineDesktop, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'doNotKnow', title: 'Do not know', icon: Icons.IconTechOutlineWatchApple, iconOptions: { fill: '#00000'}, desc: ''}
            ]
          },
          {
            id: 'notes',
            fieldName: 'details.appDefinition.notes',
            title: 'Notes',
            description: 'Add any other important information regarding your project (e.g., links to documents or existing applications, budget or timing constraints)',
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
  }
]

export default sections

export const basicSections = [
  {
    id: 'appDefinition',
    title: (project, showProduct) => {
      const product = _.get(project, 'details.products[0]')
      if (showProduct && product) {
        const prd = findProduct(product)
        if (prd) return prd
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
            icon: 'question',
            title: 'Approximately how many hours of crowd testing are you looking for?',
            description: 'If you know roughly the amount of time you want spent testing the application please list it here. If you do not know how many hours you require your copilot can assist you.',
            fieldName: 'details.appDefinition.testingHours',
            type: 'tiled-radio-group',
            dependent: true,
            depends-on: 'details.appDefinition.testingGeographies'
            depends-response: [africa, australia]
            options: [
              {value: 'upTo100', title: 'Up to 100', icon: Icons.IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'upTo250', title: 'Up to 250', icon: Icons.IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'upTo500', title: 'Up to 500', icon: Icons.IconTechOutlineDesktop, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'doNotKnow', title: 'Do not know', icon: Icons.IconTechOutlineWatchApple, iconOptions: { fill: '#00000'}, desc: ''}
            ]
          },
          {
            id: 'projectInfo',
            required: true,
            fieldName: 'description',
            description: 'Please describe your business needs.',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            title: 'In what geographies would you like to test?',
            description: 'Please select the regions from which you would like testers to participate.',
            type: 'checkbox-group',
            options: [
              {value: 'africa', label: 'Africa'},
              {value: 'asia', label: 'Asia'},
              {value: 'australia', label: 'Australia'},
              {value: 'europe', label: 'Europe'},
              {value: 'northAmerica', label: 'North America'},
              {value: 'southAmerica', label: 'South America'}
            ],
            fieldName: 'details.appDefinition.testingGeographies'
          },
          {
            icon: 'question',
            title: 'Approximately how many hours of crowd testing are you looking for?',
            description: 'If you know roughly the amount of time you want spent testing the application please list it here. If you do not know how many hours you require your copilot can assist you.',
            fieldName: 'details.appDefinition.primaryTarget',
            type: 'tiled-radio-group',
            options: [
              {value: 'upTo5', title: 'Up to 5', icon: Icons.IconTechOutlineMobile, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'upTo10', title: 'Up to 10', icon: Icons.IconTechOutlineTablet, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'upTo20', title: 'Up to 20', icon: Icons.IconTechOutlineDesktop, iconOptions: { fill: '#00000'}, desc: ''},
              {value: 'doNotKnow', title: 'Do not know', icon: Icons.IconTechOutlineWatchApple, iconOptions: { fill: '#00000'}, desc: ''}
            ]
          },
          {
            id: 'notes',
            fieldName: 'details.appDefinition.notes',
            title: 'Notes',
            description: 'Add any other important information regarding your project (e.g., links to documents or existing applications, budget or timing constraints)',
            type: 'notes'
          }
        ]
      }
    ]
  }
]
