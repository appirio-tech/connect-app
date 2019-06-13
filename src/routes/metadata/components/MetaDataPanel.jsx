/**
 * Panel component for MetaData
 */
import React from 'react'
import PropTypes from 'prop-types'

import ace from 'brace'
import 'brace/mode/json'
import 'brace/theme/github'
import { JsonEditor } from 'jsoneditor-react'
import 'jsoneditor-react/es/editor.min.css'
import _ from 'lodash'
import update from 'react-addons-update'
import SwitchButton from 'appirio-tech-react-components/components/SwitchButton/SwitchButton'
import FillProjectDetails from '../../../projects/create/components/FillProjectDetails'
import EditProjectForm from '../../../projects/detail/components/EditProjectForm'
import TemplateForm from './TemplateForm'
import CoderBroken from '../../../assets/icons/coder-broken.svg'

import './MetaDataPanel.scss'
import FullScreenJSONEditor from './FullScreenJSONEditor'

const phasesDefaultValue = {
  '1-dev-iteration-i': {
    name: 'Dev Iteration',
    products: [
      {
        productKey: 'development-iteration-5-milestones',
        id: 29
      }
    ],
    duration: 25
  }
}
const sectionsDefaultValue = [
  {
    id: 'appDefinition',
    title: 'Sample Project',
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
            validations: 'isRequired,minLength:160',
            validationErrors: {
              isRequired: 'Please provide a description',
              minLength: 'Please enter at least 160 characters'
            },
            fieldName: 'description',
            description: 'Brief Description',
            title: 'Description',
            type: 'textbox'
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Please let us know consumers of your application',
            title: 'What type of question you want to see next?',
            description: 'Description for the radio button type question',
            type: 'radio-group',
            fieldName: 'details.appDefinition.questionType',
            options: [
              {
                value: 'checkbox-group',
                label: 'Checkbox Group'
              },
              {
                value: 'slide-radiogroup',
                label: 'Slide Radio Group'
              },
              {
                value: 'tiled-radio-group',
                label: 'Tiled Radio Group'
              }
            ]
          },
          {
            icon: 'question',
            required: true,
            validationError: 'Validation error for tiled radio group question',
            title: 'Sample tiled radio group question?',
            description: 'Description for tiled radio group question',
            fieldName: 'details.appDefinition.sampleTiledRadioGroup',
            type: 'tiled-radio-group',
            condition: 'details.appDefinition.questionType == \'tiled-radio-group\'',
            options: [
              {
                value: 'value1',
                title: 'Value 1',
                icon: 'icon-test-unstructured',
                iconOptions: {
                  fill: '#00000'
                },
                desc: ''
              },
              {
                value: 'value2',
                title: 'Value 2',
                icon: 'icon-test-structured',
                iconOptions: {
                  fill: '#00000'
                },
                desc: ''
              },
              {
                value: 'value3',
                title: 'Value 3',
                icon: 'icon-dont-know',
                iconOptions: {
                  fill: '#00000'
                },
                desc: ''
              }
            ]
          },
          {
            icon: 'question',
            title: 'Sample Checkbox group type question',
            description: 'Description for checkbox group type question',
            fieldName: 'details.appDefinition.sampleCheckboxGroup',
            type: 'checkbox-group',
            condition: 'details.appDefinition.questionType == \'checkbox-group\'',
            options: [
              {
                value: 'value1',
                label: 'Value 1'
              },
              {
                value: 'value2',
                label: 'Value 2'
              }
            ]
          },
          {
            icon: 'question',
            description: 'How much budget do you have?',
            title: 'Sample Slide Radio Group type question',
            fieldName: 'details.appDefinition.sampleSlideRadioGroup',
            type: 'slide-radiogroup',
            condition: 'details.appDefinition.questionType == \'slide-radiogroup\'',
            options: [
              {
                value: 'upto-25',
                title: 'Under $25K '
              },
              {
                value: 'upto-50',
                title: '$25K to $50K'
              },
              {
                value: 'upto-75',
                title: '$50K to $75K'
              },
              {
                value: 'upto-100',
                title: '$75K to $100K'
              },
              {
                value: 'above-100',
                title: 'More than $100K'
              }
            ],
            required: true,
            validationError: 'Please provide value for sample radio group question'
          }
        ]
      },
      {
        id: 'notes',
        fieldName: 'details.appDefinition.notes',
        title: 'Notes',
        description: 'Add any other important information regarding your project (e.g. links to documents or existing applications)',
        type: 'notes'
      }
    ]
  }
]

class MetaDataPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTemplateType: '',
      metadataType: '',
      currentTemplateName: '',
      primaryKeyName: '',
      metadata: null,
      isNew: false,
      isProcessing: false,
      project: {},
      fields: [],
      isFullScreen: false,
      editMode: false,
    }
    this.init = this.init.bind(this)
    this.getMetadata = this.getMetadata.bind(this)
    this.getProjectTypeOptions = this.getProjectTypeOptions.bind(this)
    this.getProductCategoryOptions = this.getProductCategoryOptions.bind(this)
    this.getResourceNameFromType = this.getResourceNameFromType.bind(this)
    this.enterFullScreen = this.enterFullScreen.bind(this)
    this.exitFullScreen = this.exitFullScreen.bind(this)
    this.onJSONEdit = this.onJSONEdit.bind(this)
    this.onCreate = this.onCreate.bind(this)

    this.onCreateTemplate = this.onCreateTemplate.bind(this)
    this.onSaveTemplate = this.onSaveTemplate.bind(this)
    this.onDeleteTemplate = this.onDeleteTemplate.bind(this)
    this.onChangeTemplate = this.onChangeTemplate.bind(this)
    this.toggleEditMode = this.toggleEditMode.bind(this)
    this.renderProjectPreview = this.renderProjectPreview.bind(this)
    this.renderProductPreview = this.renderProductPreview.bind(this)
  }

  componentDidMount() {
    document.title = 'Metadata Management - TopCoder'
  }


  componentWillMount() {
    const { templates } = this.props
    if (templates && (!templates.productTemplates && !templates.isLoading)) {
      this.props.loadProjectsMetadata()
    } else {
      this.init(this.props)
    }
  }

  init(props) {
    const { metadataType, isNew, templates } = props
    this.setState({
      project: {
        details: {appDefinition: {}}, version: 'v2'
      },
      dirtyProject: {details: {}, version: 'v2'},
      fields: this.getFields(props),
      metadata: this.getMetadata(props),
      metadataType,
      isNew,
      isUpdating: templates.isLoading,
    })
  }

  getMetadata(props) {
    const { metadata, metadataType, isNew } = props
    const { metadata : dirtyMetadata } = this.state
    if (isNew && !metadata && !dirtyMetadata) {
      if (metadataType === 'projectTemplate') {
        return { scope: { sections: sectionsDefaultValue }, phases: phasesDefaultValue }
      }
      if (metadataType === 'productTemplate') {
        return { template: { questions: sectionsDefaultValue } }
      }
      if (metadataType === 'projectType') {
        return { metadata: {} }
      }
      if (metadataType === 'milestoneTemplate') {
        return { metadata: {} }
      }
      return {}
    }
    return metadata ? metadata : dirtyMetadata
  }

  getResourceNameFromType(type) {
    if (type === 'productCategory') {
      return 'productCategories'
    }
    return type + 's'
  }

  getProductCategoryOptions(productCategories) {
    return _.map(productCategories, (category) => {
      return {
        value: category.key,
        title: category.displayName
      }
    })

  }

  getProjectTypeOptions(projectTypes) {
    return _.map(projectTypes, (type) => {
      return {
        value: type.key,
        title: type.displayName
      }
    })
  }

  /**
   * get all fields of metadata
   */
  getFields(props) {
    const { metadataType, templates } = props
    let fields = []
    const metadata = this.getMetadata(props)
    if (metadataType === 'productTemplate') {
      const prodCatOptions = this.getProductCategoryOptions(templates.productCategories)
      const categoryValue = metadata && metadata.category ? metadata.category : prodCatOptions[0].value
      const subCategoryValue = metadata && metadata.subCategory ? metadata.subCategory : prodCatOptions[0].value
      fields = fields.concat([
        { key: 'id', type: 'number' },
        { key: 'name', type: 'text' },
        { key: 'productKey', type: 'text' },
        { key: 'category', type: 'dropdown', options: prodCatOptions, value: categoryValue },
        { key: 'subCategory', type: 'dropdown', options: prodCatOptions, value: subCategoryValue },
        { key: 'icon', type: 'text' },
        { key: 'brief', type: 'text' },
        { key: 'details', type: 'text' },
        { key: 'aliases', type: 'array' },
        { key: 'disabled', type: 'checkbox' },
        { key: 'hidden', type: 'checkbox' },
        { key: 'isAddOn', type: 'checkbox' },
      ])
    } else if (metadataType === 'projectTemplate') {
      const projectTypeOptions = this.getProductCategoryOptions(templates.projectTypes)
      const value = metadata && metadata.category ? metadata.category : projectTypeOptions[0].value
      fields = fields.concat([
        { key: 'id', type: 'number' },
        { key: 'name', type: 'text' },
        { key: 'key', type: 'text' },
        { key: 'category', type: 'dropdown', options: projectTypeOptions, value },
        { key: 'icon', type: 'text' },
        { key: 'question', type: 'text' },
        { key: 'info', type: 'text' },
        { key: 'aliases', type: 'array' },
        { key: 'phases', type: 'json', value: phasesDefaultValue },
        { key: 'disabled', type: 'checkbox' },
        { key: 'hidden', type: 'checkbox' },
      ])
    } else if (metadataType === 'projectType') {
      fields = fields.concat([
        { key: 'key', type: 'text' },
        { key: 'displayName', type: 'text' },
        { key: 'icon', type: 'text' },
        { key: 'question', type: 'text' },
        { key: 'info', type: 'text' },
        { key: 'aliases', type: 'array' },
        { key: 'metadata', type: 'json' },
        { key: 'disabled', type: 'checkbox' },
        { key: 'hidden', type: 'checkbox' },
      ])
    } else if (metadataType === 'productCategory') {
      fields = fields.concat([
        { key: 'key', type: 'text' },
        { key: 'displayName', type: 'text' },
        { key: 'icon', type: 'text' },
        { key: 'question', type: 'text' },
        { key: 'info', type: 'text' },
        { key: 'aliases', type: 'array' },
        // { key: 'metadata', type: 'json' },
        { key: 'disabled', type: 'checkbox' },
        { key: 'hidden', type: 'checkbox' },
      ])
    } else if (metadataType === 'milestoneTemplate') {
      const productTemplateOptions = templates.productTemplates.map((item) => {
        return {
          value: item.id,
          title: `(${item.id}) ${item.name}`
        }
      })

      fields = fields.concat([
        { key: 'name', type: 'text' },
        { key: 'description', type: 'textarea' },
        { key: 'duration', type: 'number' },
        { key: 'type', type: 'text' },
        { key: 'order', type: 'number' },
        { key: 'plannedText', type: 'textarea' },
        { key: 'activeText', type: 'textarea' },
        { key: 'completedText', type: 'textarea' },
        { key: 'blockedText', type: 'textarea' },
        { key: 'reference', type: 'text', readonly: true, value: 'productTemplate' },
        { key: 'referenceId', type: 'dropdown', options: productTemplateOptions, value: String(productTemplateOptions[0].value) },
        { key: 'metadata', type: 'json' },
        { key: 'hidden', type: 'checkbox' },
      ])
    }
    return fields
  }

  onCreate() {
    this.onCreateTemplate(false)
  }

  /**
   * create new template
   */
  onCreateTemplate(isDuplicate) {
    const { fields, metadata, metadataType } = this.state
    const newValues = _.assign({}, metadata)
    if (!isDuplicate) {
      _.forEach(fields, (field) => {
        switch (field.type) {
        case 'checkbox':
          newValues[field.key] = false
          break
        default:
          newValues[field.key] = null
          break
        }
      })
      if (metadataType === 'productTemplate') {
        newValues.template = {}
      }

      if (metadataType === 'projectTemplate') {
        newValues.scope = {}
      }
    } else {
      if (newValues.hasOwnProperty('id')) {
        newValues.id = null
      }
      if (newValues.hasOwnProperty('aliases')) {
        newValues.aliases = null
      }
      newValues.key = null
    }

    this.setState({
      metadata: newValues,
      isNew: true,
    })
  }

  /**
   * save template
   */
  onSaveTemplate(id, data) {
    const {metadataType, isNew } = this.state
    const omitKeys = ['createdAt', 'createdBy', 'updatedAt', 'updatedBy']
    if (!isNew) {
      if (metadataType === 'productTemplates') {
        omitKeys.push('aliases')
      }
      const payload = _.omit(data, omitKeys)
      const metadataResource = this.getResourceNameFromType(metadataType)
      this.props.updateProjectsMetadata(id, metadataResource, payload)
        .then((res) => {
          if (!res.error) {
            this.props.loadProjectsMetadata()
          }
        })
    } else {
      let payload = _.omit(data, omitKeys)
      const noKeys = ['milestoneTemplate', 'productTemplate']
      if (noKeys.includes(metadataType)) {
        payload = _.omit(payload, ['key'])
      }
      const metadataResource = this.getResourceNameFromType(metadataType)
      this.props.createProjectsMetadata(payload)
        .then((res) => {
          if (!res.error) {
            const createdMetadata = res.action.payload
            if (['projectTemplate', 'productTemplate', 'milestoneTemplate'].indexOf(metadataType) !== -1) {
              window.location = `/metadata/${metadataResource}/${createdMetadata.id}`
            } else {
              window.location = `/metadata/${metadataResource}/${createdMetadata.key}`
            }
          }
        })
    }
  }

  /**
   * delete template
   */
  onDeleteTemplate(value) {
    const {metadataType} = this.state
    const metadataResource = this.getResourceNameFromType(metadataType)
    this.props.deleteProjectsMetadata(value, metadataResource)
      .then((res) => {
        if (!res.error) {
          window.location = `/metadata/${metadataResource}`
        }
      })
  }

  /**
   * change current template
   */
  onChangeTemplate(data) {
    const { metadata } = this.state
    const newTemplate = _.assign({}, metadata, data)
    this.setState({
      metadata: newTemplate,
    })
  }

  onJSONEdit(jsObject) {
    const { metadataType } = this.state
    if (metadataType === 'productTemplate') {
      const updateQuery = { template : { $set : jsObject } }
      this.setState(update(this.state, { metadata: updateQuery }))
    }
    if (metadataType === 'projectTemplate') {
      const updateQuery = { scope : { $set : jsObject } }
      this.setState(update(this.state, { metadata: updateQuery }))
    }
  }

  enterFullScreen() {
    this.setState({ isFullScreen : true })
  }

  exitFullScreen() {
    this.setState({ isFullScreen : false })
  }

  toggleEditMode() {
    this.setState({ editMode: !this.state.editMode })
  }

  renderProjectPreview({ metadata, template }) {
    const { templates, previewProject } = this.props
    const { editMode } = this.state

    return (
      <div className="content template-preview">
        <div className="header">
          <h1>Template form preview</h1>
          <SwitchButton
            label="edit mode"
            checked={editMode}
            onChange={this.toggleEditMode}
          />
        </div>
        {
          editMode ? (
            <EditProjectForm
              shouldUpdateTemplate
              project={previewProject}
              saving={false}
              template={template}
              productTemplates={templates.productTemplates}
              productCategories={templates.productCategories}
              isEdittable
              submitHandler={() => { }}
              fireProjectDirty={this.props.firePreviewProjectDirty}
              fireProjectDirtyUndo={() => { }}
              showHidden
              addAttachment={() => { }}
              updateAttachment={() => { }}
              removeAttachment={() => { }}
            />
          ) : (
            <FillProjectDetails
              shouldUpdateTemplate
              onBackClick={() => { }}
              onCreateProject={() => { }}
              onChangeProjectType={() => { }}
              project={{
                templateId: metadata.id || 'new',
                details: {},
                ...previewProject
              }}
              dirtyProject={previewProject}
              templates={[]}
              onProjectChange={this.props.firePreviewProjectDirty}
              projectTemplates={[{
                ...metadata,
                id: metadata.id || 'new'
              }]}
              productTemplates={templates.productTemplates}
              productCategories={templates.productCategories}
            />
          )
        }
      </div>
    )
  }

  renderProductPreview({ template }) {
    const { templates, previewProject } = this.props

    // as productTemplate's template has `questions` root element instead of `sections`
    // we normalize it for the EditProjectForm component
    const normalizedTemplate = {
      ..._.omit(template, 'questions'),
      sections: template.questions
    }

    return (
      <div className="content template-preview">
        <div className="header">
          <h1>Template form preview</h1>
        </div>
        <EditProjectForm
          shouldUpdateTemplate
          project={previewProject}
          saving={false}
          template={normalizedTemplate}
          productTemplates={templates.productTemplates}
          productCategories={templates.productCategories}
          isEdittable
          submitHandler={() => { }}
          fireProjectDirty={this.props.firePreviewProjectDirty}
          fireProjectDirtyUndo={() => { }}
          showHidden
          addAttachment={() => { }}
          updateAttachment={() => { }}
          removeAttachment={() => { }}
        />
      </div>
    )
  }

  render() {
    const { isAdmin, metadataType, templates } = this.props
    const { fields, metadata, isNew, isFullScreen } = this.state
    let template = {}
    if (metadata && metadataType === 'projectTemplate' && metadata.scope) {
      template = metadata.scope
    } else if (metadata && metadataType === 'productTemplate' && metadata.template) {
      template = metadata.template
    }
    // TODO remove: temporary let non-admin user see metadata (they still couldn't save because server will reject)
    if (!isAdmin && isAdmin) {
      return (
        <section className="content content-error">
          <div className="container">
            <div className="page-error">
              <CoderBroken className="icon-coder-broken" />
              <span>You don't have permission to access Metadata Management</span>
            </div>
          </div>
        </section>
      )
    }

    return (
      <div className="meta-data-panel">
        {
          isFullScreen && (
            <FullScreenJSONEditor
              onExit={this.exitFullScreen}
              onJSONEdit={this.onJSONEdit}
              json={template}
            />
          )
        }
        {
          (metadata && metadataType === 'projectTemplate') &&
          this.renderProjectPreview({ metadata, template })
        }
        {
          (metadata && metadataType === 'productTemplate') &&
          this.renderProductPreview({ metadata, template })
        }
        <aside className="filters">
          { (metadata || isNew) && (['projectTemplate', 'productTemplate'].indexOf(metadataType) !== -1)  && (
            <div className="json_editor_wrapper">
              <button type="button" className="tc-btn tc-btn-primary tc-btn-sm maximize-btn" onClick={this.enterFullScreen}>Maximize</button>
              <JsonEditor
                value={template}
                ace={ace}
                onChange={this.onJSONEdit}
                mode="code"
                allowedModes={ ['code', 'tree', 'view']}
                theme="ace/theme/github"
              />
            </div>
          )
          }
          { !templates.isLoading && (!!metadata || isNew ) && (
            <TemplateForm
              metadata={metadata}
              metadataType={metadataType}
              deleteTemplate={this.onDeleteTemplate}
              changeTemplate={this.onChangeTemplate}
              saveTemplate={this.onSaveTemplate}
              createTemplate={this.onCreateTemplate}
              isNew={isNew}
              fields={fields}
              loadProjectMetadata={this.props.loadProjectsMetadata}
              productCategories={templates['productCategories']}
              projectTypes={templates['projectTypes']}
            />)
          }
        </aside>
      </div>
    )
  }
}

MetaDataPanel.defaultProps = {
  previewProject: { details: {} },
  firePreviewProjectDirty: () => {}
}

MetaDataPanel.propTypes = {
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProjectsMetadata: PropTypes.func.isRequired,
  createProjectsMetadata: PropTypes.func.isRequired,
  updateProjectsMetadata: PropTypes.func.isRequired,
  templates: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  previewProject: PropTypes.object,
  firePreviewProjectDirty: PropTypes.func,
}

export default MetaDataPanel
