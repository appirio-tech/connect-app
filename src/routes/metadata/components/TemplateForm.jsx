/**
 * Metadata Fields Form
 */
import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import JSONInput from 'react-json-editor-ajrm'
import locale    from 'react-json-editor-ajrm/locale/en'
import SelectDropdown from '../../../components/SelectDropdown/SelectDropdown'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields
const Formsy = FormsyForm.Formsy


import './TemplateForm.scss'

class TemplateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      valid: false,
      fields: [],
      textAreaValid: true,
      productCategories: [],
      projectTypes: [],
      values: null,
      dirty: false,
      isFocused: false,
      isChange: false,
      showDeleteConfirm: false,
      primaryKeyType: '',
      primaryKeyValue: null,
      verifyPrimaryKeyValue: null,
      forcedError: {
        verifyPrimaryKeyValue: null,
      }
    }
    this.onValid = this.onValid.bind(this)
    this.onInvalid = this.onInvalid.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onDuplicate = this.onDuplicate.bind(this)
    this.showDelete = this.showDelete.bind(this)
    this.cancelDelete = this.cancelDelete.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.onChangeDropdown = this.onChangeDropdown.bind(this)
    this.onVerifyPrimaryKeyValueChange = this.onVerifyPrimaryKeyValueChange.bind(this)
    this.init = this.init.bind(this)
  }

  componentDidMount() {
    // this.init(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps)
  }

  componentWillMount() {
    this.init(this.props)
  }

  init(props) {
    const { metadata, metadataType, isNew } = props
    const name = metadataType
    const type = metadata && metadata.hasOwnProperty('id') ? 'number' : 'text'
    let primaryKeyValue = null
    primaryKeyValue = metadata && metadata.hasOwnProperty('id') ? metadata['id'] : null
    primaryKeyValue = metadata && !metadata.hasOwnProperty('id') ? metadata['key'] : primaryKeyValue

    this.setState({
      // productCategories: metadataType === 'productTemplate' ? this.getProductCategoryOptions() : [],
      // projectTypes: metadataType === 'projectTemplate' ? this.getProjectTypeOptions() : [],
      values: isNew && !metadata ? {} : metadata,
      name,
      primaryKeyType: type,
      primaryKeyValue
    })
  }

  getField(field, isRequired=true) {
    const { values } = this.state
    const validations = null
    const type = field['type']
    const label = field['key']
    const isDropdown = type === 'dropdown'
    const isObject = type === 'object'
    const isJSON = type === 'json'
    const isCheckbox = type === 'checkbox'
    const isTextBox = !isDropdown && !isCheckbox && !isObject && !isJSON
    const options = isDropdown ? field['options'] : []
    let value = field['value']
    let isReadOnly = false
    let isHidden = false
    if (values && values[label]) {
      value = field['type'] === 'object' ? JSON.stringify(values[label]) : values[label]
      if (values.hasOwnProperty('id') && label === 'id') {
        if (!this.props.isNew) {
          isReadOnly = true
        }
      }
      if (!values.hasOwnProperty('id') && label === 'key') {
        if (!this.props.isNew) {
          isReadOnly = true
        }
      }
    } else if (isCheckbox) {
      value = false
    }

    if (label === 'id') {
      isHidden = true
    }

    return (
      !isHidden && <div className="field" key={label}>
        <div className="label">{`${!isCheckbox ? label : ''}`}</div>
        {
          isTextBox && (
            <TCFormFields.TextInput
              wrapperClass="input-field"
              type={type}
              name={label}
              validations={validations}
              value={value || ''}
              validationError={`Please enter ${label}`}
              required={isRequired}
              readonly={isReadOnly}
            />
          )
        }
        {
          isDropdown && (
            <div className="dropdown-field">
              <SelectDropdown
                name={label}
                options={options}
                theme="default"
                onSelect={ this.onChangeDropdown }
                value={value}
                required
              />
            </div>
          )
        }
        {
          isCheckbox && (
            <div className="checkbox">
              <TCFormFields.Checkbox
                ref={label}
                name={label}
                label={label}
                value={value}
              />
            </div>
          )
        }
        {
          isObject && (
            <TCFormFields.Textarea
              wrapperClass="textarea-field"
              name={label}
              value={value}
              validations={validations}
              validationError={`Please enter ${label}`}
            />
          )
        }
        {
          isJSON && (
            <div className="json_editor_wrapper">
              <JSONInput
                id={ `${label}JSON` }
                placeholder ={ value }
                theme="dark_vscode_tribute"
                locale={ locale }
                height="250px"
                // width='0px'
                onChange={ (params) => { this.onJSONEdit(field, params) } }
                // onKeyPressUpdate={false}
                waitAfterKeyPress={3000}
              />
            </div>
          )
        }
      </div>
    )
  }

  onValid() {
    this.setState({valid: true})
  }

  onInvalid() {
    this.setState({valid: false})
  }

  /**
   * Validate the id before delete template
   */
  validate(state) {
    const errors = {
      verifyPrimaryKeyValue: null,
    }

    if (state.verifyPrimaryKeyValue !== null && state.verifyPrimaryKeyValue !== state.primaryKeyValue.toString()) {
      errors.verifyPrimaryKeyValue = `The ${state.primaryKeyType === 'number' ? 'id' : 'key'} do not match`
    }
    return errors
  }

  onVerifyPrimaryKeyValueChange(type, value) {
    const newState = {...this.state,
      verifyPrimaryKeyValue: value,
      isFocused: true,
    }
    newState.forcedError = this.validate(newState)
    this.setState(newState)
  }

  onDuplicate() {
    this.props.createTemplate(true)
  }

  onSave() {
    const { saveTemplate } = this.props
    const { primaryKeyValue, values } = this.state
    let payload = values

    if (values.hasOwnProperty('aliases')) {
      const aliases = _.split(values.aliases, ',')
      payload = _.assign({}, payload, { aliases })
    }
    saveTemplate(primaryKeyValue, payload)
  }

  showDelete() {
    this.setState({
      showDeleteConfirm: true,
    })
  }

  cancelDelete() {
    this.setState({
      showDeleteConfirm: false,
    })
  }

  confirmDelete() {
    const { forcedError, primaryKeyValue } = this.state
    if (!forcedError.verifyPrimaryKeyValue) {
      this.setState({
        showDeleteConfirm: false
      })
      this.props.deleteTemplate(primaryKeyValue)
    }
  }

  onChangeDropdown(option) {
    const { values } = this.state
    this.setState({
      values: _.assign({}, values, {category: option.value})
    })
  }

  onChange(currentValues, isChanged) {
    const { changeTemplate } = this.props
    console.log(currentValues)
    this.setState({ dirty: isChanged })
    if (currentValues.hasOwnProperty('metadata')) {
      try {
        currentValues.metadata = JSON.parse(currentValues.metadata)
        this.setState({ textAreaValid: true})
        changeTemplate(currentValues)
      } catch (e) {
        this.setState({ textAreaValid: false})
      }
    } else if (currentValues.hasOwnProperty('phases')) {
      try {
        currentValues.phases = JSON.parse(currentValues.phases)
        this.setState({ textAreaValid: true})
        changeTemplate(currentValues)
      } catch (e) {
        this.setState({ textAreaValid: false})
      }
    } else {
      changeTemplate(currentValues)
    }
  }

  onJSONEdit(field, { jsObject }) {
    const { values } = this.state
    // const type = field['type']
    const label = field['key']
    const updatedJSONValue = {}
    updatedJSONValue[`${label}`] = jsObject
    this.setState({
      values: _.assign({}, values, updatedJSONValue)
    })
  }

  render() {
    const { fields } = this.props
    const {
      // name,
      showDeleteConfirm,
      primaryKeyType,
      verifyPrimaryKeyValue,
      forcedError,
    } = this.state
    const isRequired = true
    return (
      <div className="template-form-container">
        <Formsy.Form
          className="template-form"
          onInvalid={this.onInvalid}
          onValidSubmit={this.onSubmit}
          onValid={this.onValid}
          onChange={this.onChange}
        >
          {
            _.map(fields, (field) => this.getField(field))
          }
          <div className="controls">
            <button
              type="submit"
              className="tc-btn tc-btn-primary"
              disabled={!this.state.valid || !this.state.textAreaValid}
              onClick={this.onSave}
            >
              Save
            </button>
            <button
              type="submit"
              className="tc-btn tc-btn-primary"
              onClick={this.onDuplicate}
              disabled={this.props.isNew}
            >
              Duplicate
            </button>
            <button
              type="submit"
              className="tc-btn tc-btn-warning"
              onClick={this.showDelete}
              disabled={this.props.isNew}
            >
              Delete
            </button>
          </div>
        </Formsy.Form>
        <Modal
          isOpen={ showDeleteConfirm }
          className="delete-template-dialog"
          overlayClassName="delete-template-dialog-overlay"
          onRequestClose={ this.cancelDelete }
          contentLabel=""
        >

          <div className="modal-title">
            Are you sure you want to delete this template?
          </div>
          <div className="modal-body">
            Please enter the {primaryKeyType === 'number' ? 'id' : 'key'} of the template to be deleted
          </div>
          <Formsy.Form>
            <TCFormFields.TextInput
              wrapperClass="input-field"
              type={primaryKeyType}
              name={primaryKeyType}
              validations={null}
              onChange={this.onVerifyPrimaryKeyValueChange}
              forceErrorMessage={forcedError['verifyPrimaryKeyValue']}
              value=""
              validationError={`Please confirm the ${primaryKeyType === 'number' ? 'id' : 'key'} is the same entity as the selected one`}
              required={isRequired}
            />
          </Formsy.Form>

          <div className="button-area flex center action-area">
            <button
              className="tc-btn tc-btn-default tc-btn-sm action-btn btn-cancel"
              onClick={this.cancelDelete}
            >Cancel</button>
            <button
              className="tc-btn tc-btn-warning tc-btn-sm action-btn "
              onClick={this.confirmDelete}
              disabled={!verifyPrimaryKeyValue || forcedError.verifyPrimaryKeyValue}
            >Delete
            </button>
          </div>
        </Modal>
      </div>
    )
  }
}

TemplateForm.propTypes = {
  isNew: PropTypes.bool.isRequired,
  fields: PropTypes.array.isRequired,
  productCategories: PropTypes.array.isRequired,
  projectTypes: PropTypes.array.isRequired,
  metadata: PropTypes.object.isRequired,
  metadataType: PropTypes.string.isRequired,
  deleteTemplate: PropTypes.func.isRequired,
  saveTemplate: PropTypes.func.isRequired,
  changeTemplate: PropTypes.func.isRequired,
  createTemplate: PropTypes.func.isRequired,
  loadProjectMetadata: PropTypes.func.isRequired,
}

export default TemplateForm
