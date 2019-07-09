/**
 * Panel component for MetaData
 */
import React from 'react'
import PropTypes from 'prop-types'

import ace from 'brace'
import 'brace/mode/json'
import 'brace/theme/github'
import { JsonEditor } from 'jsoneditor-react'
import Modal from 'react-modal'
import 'jsoneditor-react/es/editor.min.css'
import _ from 'lodash'
import moment from 'moment'
import update from 'react-addons-update'
import SwitchButton from 'appirio-tech-react-components/components/SwitchButton/SwitchButton'
import FillProjectDetails from '../../../projects/create/components/FillProjectDetails'
import EditProjectForm from '../../../projects/detail/components/EditProjectForm'
import TemplateForm from './TemplateForm'
import CoderBroken from '../../../assets/icons/coder-broken.svg'
import XMarkIcon from '../../../assets/icons/x-mark.svg'

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
      metadataWithVersion: false,
      modalOpen: false,
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
    this.getVersionOptions = this.getVersionOptions.bind(this)
    this.onCreateNewVersion = this.onCreateNewVersion.bind(this)
    this.onLoadRevisionData = this.onLoadRevisionData.bind(this)
    this.onChangeDropdown = this.onChangeDropdown.bind(this)
    this.toggleModalOpen = this.toggleModalOpen.bind(this)
    this.renderModal = this.renderModal.bind(this)
    this.setJsonEditorRef = instance => this.jsonEditor = instance
  }

  componentDidMount() {
    document.title = 'Metadata Management - TopCoder'
  }


  componentWillMount() {
    const { templates, metadataType } = this.props
    const keys = ['form', 'planConfig', 'priceConfig']
    const metadataWithVersion = keys.includes(metadataType)
    if (templates && (!templates.productTemplates && !metadataWithVersion && !templates.isLoading)) {
      this.props.loadProjectsMetadata()
    } else {
      this.init(this.props, metadataWithVersion)
    }
  }

  init(props, metadataWithVersion) {
    const { metadataType, isNew, templates } = props
    const fields = this.getFields(props, metadataWithVersion)
    const metadata = this.getMetadata(props)
    if (metadataWithVersion && metadata && metadata.key
      && templates.versionMetadataType && (templates.versionMetadataType === metadataType)
      && !this.props.metadataRevisionsLoading) {
      this.props.getRevisionList(metadataType, metadata.key, metadata.version)
    }
    this.setState({
      project: {
        details: {appDefinition: {}}, version: 'v2'
      },
      dirtyProject: {details: {}, version: 'v2'},
      fields,
      metadata,
      metadataType,
      isNew,
      isUpdating: templates.isLoading,
      metadataWithVersion,
    })
  }

  getMetadata(props) {
    const { metadata, metadataType, isNew, templates } = props
    let persistedMetaFormData = templates.persistedMetaFormData
    const { metadata : dirtyMetadata } = this.state
    if (isNew && !metadata && !dirtyMetadata) {
      if (metadataType === 'projectTemplate') {
        if (persistedMetaFormData) {
          return { scope: persistedMetaFormData.scope, phases: persistedMetaFormData.phases, category: persistedMetaFormData.category }
        }
        return { scope: { sections: sectionsDefaultValue }, phases: phasesDefaultValue }
      }
      if (metadataType === 'productTemplate') {
        if (persistedMetaFormData) {
          return { template: persistedMetaFormData.template, category: persistedMetaFormData.category, subCategory: persistedMetaFormData.subCategory }
        }
        return { template: { sections: sectionsDefaultValue } }
      }
      if (metadataType === 'projectType') {
        return { metadata: {} }
      }
      if (metadataType === 'milestoneTemplate') {
        return { metadata: {} }
      }
      if (metadataType === 'form' || metadataType === 'planConfig' || metadataType === 'priceConfig') {
        return { config: {} }
      }
      return {}
    }
    return metadata ? metadata : dirtyMetadata
  }

  getResourceNameFromType(type) {
    if (type === 'productCategory') {
      return 'productCategories'
    }
    if (this.state.metadataWithVersion) {
      return type
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

  getVersionOptions(versionOptions) {
    return _.map(versionOptions, (versionOption) => {
      return {
        value: _.toString(versionOption.version),
        title: _.toString(versionOption.version)
      }
    })
  }

  /**
   * get all fields of metadata
   */
  getFields(props, metadataWithVersion) {
    const { metadataType, templates, isNew } = props
    let persistedMetaFormData = templates.persistedMetaFormData
    let fields = []
    const metadata = this.getMetadata(props)
    if (metadataType === 'productTemplate') {
      const prodCatOptions = this.getProductCategoryOptions(templates.productCategories)
      const categoryValue = metadata && metadata.category ? metadata.category : prodCatOptions[0].value
      const subCategoryValue = metadata && metadata.subCategory ? metadata.subCategory : prodCatOptions[0].value
      fields = fields.concat([
        { key: 'id', type: 'number'},
        { key: 'name', type: 'text', value: persistedMetaFormData && persistedMetaFormData.name },
        { key: 'productKey', type: 'text', value: persistedMetaFormData && persistedMetaFormData.productKey },
        { key: 'category', type: 'dropdown', options: prodCatOptions, value: categoryValue },
        { key: 'subCategory', type: 'dropdown', options: prodCatOptions, value: subCategoryValue },
        { key: 'icon', type: 'text', value: persistedMetaFormData && persistedMetaFormData.icon },
        { key: 'brief', type: 'text', value: persistedMetaFormData && persistedMetaFormData.brief },
        { key: 'details', type: 'text', value: persistedMetaFormData && persistedMetaFormData.details },
        { key: 'aliases', type: 'array', value: persistedMetaFormData && persistedMetaFormData.aliases },
        { key: 'disabled', type: 'checkbox', value: persistedMetaFormData && persistedMetaFormData.disabled },
        { key: 'hidden', type: 'checkbox', value: persistedMetaFormData && persistedMetaFormData.hidden },
        { key: 'isAddOn', type: 'checkbox', value: persistedMetaFormData && persistedMetaFormData.isAddOn },
      ])
    } else if (metadataType === 'projectTemplate') {
      const projectTypeOptions = this.getProductCategoryOptions(templates.projectTypes)
      const value = metadata && metadata.category ? metadata.category : projectTypeOptions[0].value
      fields = fields.concat([
        { key: 'id', type: 'number' },
        { key: 'name', type: 'text', value: persistedMetaFormData && persistedMetaFormData.name },
        { key: 'key', type: 'text', value: persistedMetaFormData && persistedMetaFormData.key },
        { key: 'category', type: 'dropdown', options: projectTypeOptions, value },
        { key: 'icon', type: 'text', value: persistedMetaFormData && persistedMetaFormData.icon },
        { key: 'question', type: 'text', value: persistedMetaFormData && persistedMetaFormData.question },
        { key: 'info', type: 'text', value: persistedMetaFormData && persistedMetaFormData.info },
        { key: 'aliases', type: 'array', value: persistedMetaFormData && persistedMetaFormData.aliases },
        { key: 'phases', type: 'json', value: metadata.phases },
        { key: 'disabled', type: 'checkbox', value: persistedMetaFormData && persistedMetaFormData.disabled },
        { key: 'hidden', type: 'checkbox', value: persistedMetaFormData && persistedMetaFormData.hidden },
      ])
    } else if (metadataType === 'projectType') {
      fields = fields.concat([
        { key: 'key', type: 'text', value: persistedMetaFormData && persistedMetaFormData.key },
        { key: 'displayName', type: 'text', value: persistedMetaFormData && persistedMetaFormData.displayName },
        { key: 'icon', type: 'text', value: persistedMetaFormData && persistedMetaFormData.icon },
        { key: 'question', type: 'text', value: persistedMetaFormData && persistedMetaFormData.question },
        { key: 'info', type: 'text', value: persistedMetaFormData && persistedMetaFormData.info },
        { key: 'aliases', type: 'array', value: persistedMetaFormData && persistedMetaFormData.aliases },
        { key: 'metadata', type: 'json', value: persistedMetaFormData && persistedMetaFormData.metadata },
        { key: 'disabled', type: 'checkbox', value: persistedMetaFormData && persistedMetaFormData.disabled },
        { key: 'hidden', type: 'checkbox', value: persistedMetaFormData && persistedMetaFormData.hidden },
      ])
    } else if (metadataWithVersion) {
      if (isNew) {
        fields = fields.concat([
          { key: 'key', type: 'text' },
          { key: 'config', type: 'jsonfullscreen' },
        ])
      } else {
        const projectVersionOptions = this.getVersionOptions(templates.versionOptions)
        const value = metadata && metadata.version ? metadata.version : ''
        fields = fields.concat([
          { key: 'key', type: 'text' },
          { key: 'version', type: 'dropdown', options: projectVersionOptions, value },
          { key: 'config', type: 'jsonfullscreen' },
        ])
      }
    } else if (metadataType === 'productCategory') {
      fields = fields.concat([
        { key: 'key', type: 'text', value: persistedMetaFormData && persistedMetaFormData.key },
        { key: 'displayName', type: 'text', value: persistedMetaFormData && persistedMetaFormData.displayName },
        { key: 'icon', type: 'text', value: persistedMetaFormData && persistedMetaFormData.icon },
        { key: 'question', type: 'text', value: persistedMetaFormData && persistedMetaFormData.question },
        { key: 'info', type: 'text', value: persistedMetaFormData && persistedMetaFormData.info },
        { key: 'aliases', type: 'array', value: persistedMetaFormData && persistedMetaFormData.aliases },
        // { key: 'metadata', type: 'json' },
        { key: 'disabled', type: 'checkbox', value: persistedMetaFormData && persistedMetaFormData.disabled },
        { key: 'hidden', type: 'checkbox', value: persistedMetaFormData && persistedMetaFormData.hidden },
      ])
    } else if (metadataType === 'milestoneTemplate') {
      const productTemplateOptions = templates.productTemplates.map((item) => {
        return {
          value: item.id,
          title: `(${item.id}) ${item.name}`
        }
      })

      fields = fields.concat([
        { key: 'name', type: 'text', value: persistedMetaFormData && persistedMetaFormData.name },
        { key: 'description', type: 'textarea', value: persistedMetaFormData && persistedMetaFormData.description },
        { key: 'duration', type: 'number', value: persistedMetaFormData && persistedMetaFormData.duration },
        { key: 'type', type: 'text', value: persistedMetaFormData && persistedMetaFormData.type },
        { key: 'order', type: 'number', value: persistedMetaFormData && persistedMetaFormData.order },
        { key: 'plannedText', type: 'textarea', value: persistedMetaFormData && persistedMetaFormData.plannedText },
        { key: 'activeText', type: 'textarea', value: persistedMetaFormData && persistedMetaFormData.activeText },
        { key: 'completedText', type: 'textarea', value: persistedMetaFormData && persistedMetaFormData.completedText },
        { key: 'blockedText', type: 'textarea', value: persistedMetaFormData && persistedMetaFormData.blockedText },
        { key: 'reference', type: 'text', readonly: true, value: 'productTemplate' },
        { key: 'referenceId', type: 'dropdown', options: productTemplateOptions, value: persistedMetaFormData && persistedMetaFormData.referenceId },
        { key: 'metadata', type: 'json', value: persistedMetaFormData && persistedMetaFormData.metadata },
        { key: 'hidden', type: 'checkbox', value: persistedMetaFormData && persistedMetaFormData.hidden },
      ])
    } else if (metadataType === 'priceConfig' || metadataType === 'planConfig' || metadataType === 'form') {
      fields = fields.concat([
        { key: 'key', type: 'text', value: persistedMetaFormData && persistedMetaFormData.key },
        { key: 'config', type: 'json', value: persistedMetaFormData && persistedMetaFormData.config },
      ])
    }
    return fields
  }

  onCreate() {
    this.onCreateTemplate(false)
  }

  onChangeDropdown(label, option) {
    const { metadataType, metadata, metadataWithVersion } = this.state
    const metadataResource = this.getResourceNameFromType(metadataType)
    if (metadataWithVersion && label === 'version') {
      window.location = `/metadata/${metadataResource}s/${metadata.key}/versions/${option.value}`
    }
  }

  onCreateNewVersion() {
    const { fields, metadata, metadataWithVersion } = this.state
    const newValues = _.assign({}, metadata)
    let newfields = _.assign({}, fields)
    if (newValues.hasOwnProperty('id')) {
      newValues.id = null
    }
    if (metadataWithVersion) {
      newValues.version = null
      newValues.revision = null
      newfields = _.pullAllBy(fields, [{ key: 'version'}], 'key')
    }
    this.setState({
      metadata: newValues,
      isNew: true,
      fields: newfields,
    })
  }

  onLoadRevisionData(id) {
    const { metadata, metadataWithVersion } = this.state
    const { templates } = this.props
    if (metadataWithVersion && templates.metadataRevisions) {
      const revision = _.find(templates.metadataRevisions, r => r.id === id)
      const newMetadata = _.assign({}, metadata, revision)
      this.setState({ metadata: newMetadata })
      this.jsonEditor.jsonEditor.set(newMetadata.config)
    }
  }

  /**
   * create new template
   */
  onCreateTemplate(isDuplicate) {
    const { fields, metadata, metadataType, metadataWithVersion } = this.state
    const newValues = _.assign({}, metadata)
    let newfields = _.assign({}, fields)
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
      if (metadataWithVersion) {
        newValues.version = null
        newValues.revision = null
        newfields = _.pullAllBy(fields, [{ key: 'version'}], 'key')
      }
      newValues.key = null
    }

    this.setState({
      metadata: newValues,
      isNew: true,
      fields: newfields,
    })
  }

  /**
   * save template
   */
  onSaveTemplate(id, data) {
    const {metadataType, isNew, metadataWithVersion } = this.state
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
            if (metadataWithVersion && this.props.routerParams.version) {
              this.props.getProjectMetadataWithVersion(metadataResource, payload.key, payload.version)
            } else{
              this.props.loadProjectsMetadata()
            }
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
            } else if (metadataWithVersion) {
              window.location = `/metadata/${metadataResource}s/${createdMetadata.key}/versions/${createdMetadata.version}`
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
    const {metadataType, metadata} = this.state
    const metadataResource = this.getResourceNameFromType(metadataType)
    if (this.state.metadataWithVersion) {
      this.props.deleteProjectsMetadata(value, metadataResource, metadata)
        .then((res) => {
          if (!res.error) {
            window.location = `/metadata/${metadataResource}s`
          }
        })
    } else {
      this.props.deleteProjectsMetadata(value, metadataResource)
        .then((res) => {
          if (!res.error) {
            window.location = `/metadata/${metadataResource}`
          }
        })
    }
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
    const { metadataType, metadataWithVersion } = this.state
    if (metadataType === 'productTemplate') {
      const updateQuery = { template : { $set : jsObject } }
      this.setState(update(this.state, { metadata: updateQuery }))
    }
    if (metadataType === 'projectTemplate') {
      const updateQuery = { scope : { $set : jsObject } }
      this.setState(update(this.state, { metadata: updateQuery }))
    }
    if (metadataWithVersion) {
      const updateQuery = { config : { $set : jsObject } }
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

  toggleModalOpen() {
    this.setState({ modalOpen: !this.state.modalOpen })
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

  renderModal() {
    const { metadataType, templates } = this.props
    const { modalOpen } = this.state
    let i = 1
    let dialogTitle = metadataType
    switch (metadataType) {
    case 'planConfig':
      dialogTitle = 'plan config'
      break
    case 'priceConfig':
      dialogTitle = 'price config'
      break
    default:
      dialogTitle = metadataType
      break
    }
    return (
      <Modal
        isOpen={ modalOpen }
        className="revision-dialog-container"
        overlayClassName="management-dialog-overlay"
        onRequestClose={this.toggleModalOpen}
        contentLabel=""
      >

        <div className="revision-dialog">
          <div className="dialog-title">
            {`${dialogTitle} history`}
            <span onClick={this.toggleModalOpen}><XMarkIcon/></span>
          </div>

          <div className="dialog-body">
            <div
              key={i}
              className={`revision-member-layout ${i%2 === 1 ? 'dark' : ''}`}
            >
              <div className="memer-details">
                <div className="member-name">
                  Revision
                </div>
                <div className="member-name">
                  Updated At
                </div>
                <div className="member-name"/>
              </div>
            </div>
            {
              (templates.metadataRevisions.map((metadataRevision) => {
                const time = moment(metadataRevision.updatedAt)
                i++
                return (
                  <div
                    key={i}
                    className={`revision-member-layout ${i%2 === 1 ? 'dark' : ''}`}
                  >
                    <div className="memer-details">
                      <div className="member-name">
                        {metadataRevision.revision}
                      </div>
                      <div className="member-name">
                        {time.year() === moment().year() ? time.format('MMM D, h:mm a') : time.format('MMM D YYYY, h:mm a')}
                      </div>
                      <div className="member-name">
                        <button type="button" className="tc-btn tc-btn-primary tc-btn-sm maximize-btn" onClick={() => this.onLoadRevisionData(metadataRevision.id)}>Load this revision</button>
                      </div>
                    </div>
                  </div>
                )
              }))
            }
          </div>
        </div>
      </Modal>
    )
  }

  renderProductPreview({ template }) {
    const { templates, previewProject } = this.props

    return (
      <div className="content template-preview">
        <div className="header">
          <h1>Template form preview</h1>
        </div>
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
      </div>
    )
  }

  render() {
    const { isAdmin, metadataType, templates } = this.props
    const { fields, metadata, isNew, metadataWithVersion, isFullScreen } = this.state
    let template = {}
    if (metadata && metadataType === 'projectTemplate' && metadata.scope) {
      template = metadata.scope
    } else if (metadata && metadataType === 'productTemplate' && metadata.template) {
      template = metadata.template
    } else if (metadata && metadataWithVersion && metadata.config) {
      template = metadata.config
    }
    console.log('render is called again')
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
        { metadataWithVersion && !templates.metadataRevisionsLoading && templates.metadataRevisions && this.renderModal() }
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
          { !isFullScreen && (metadata || isNew) && (['projectTemplate', 'productTemplate'].indexOf(metadataType) !== -1)  && (
            <div className="json_editor_wrapper">
              <button type="button" className="tc-btn tc-btn-primary tc-btn-sm maximize-btn" onClick={this.enterFullScreen}>Maximize</button>
              <JsonEditor
                value={template}
                ace={ace}
                onChange={this.onJSONEdit}
                mode="code"
                allowedModes={['code', 'tree', 'view']}
                theme="ace/theme/github"
              />
            </div>
          )
          }
          { !isFullScreen && !templates.isLoading && !templates.metadataRevisionsLoading && (!!metadata || isNew ) && (
            <TemplateForm
              metadata={metadata}
              metadataType={metadataType}
              deleteTemplate={this.onDeleteTemplate}
              changeTemplate={this.onChangeTemplate}
              saveTemplate={this.onSaveTemplate}
              createTemplate={this.onCreateTemplate}
              createNewVersion={this.onCreateNewVersion}
              dropdownChange={this.onChangeDropdown}
              enterFullScreen={this.enterFullScreen}
              changeJSONEdit={this.onJSONEdit}
              toggleModalOpen={this.toggleModalOpen}
              setJsonEditorRef={this.setJsonEditorRef}
              isNew={isNew}
              metadataWithVersion={metadataWithVersion}
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
  routerParams:{},
  firePreviewProjectDirty: () => {},
  getProjectMetadataWithVersion: () => {},
}

MetaDataPanel.propTypes = {
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProjectsMetadata: PropTypes.func.isRequired,
  createProjectsMetadata: PropTypes.func.isRequired,
  updateProjectsMetadata: PropTypes.func.isRequired,
  templates: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  previewProject: PropTypes.object,
  routerParams: PropTypes.object,
  firePreviewProjectDirty: PropTypes.func,
  getProjectMetadataWithVersion: PropTypes.func,
  getRevisionList: PropTypes.func,
}

export default MetaDataPanel
