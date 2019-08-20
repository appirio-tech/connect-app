/**
 * DesignOption section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
const TCFormFields = FormsyForm.Fields
import TextInputWithCounter from '../../../../components/TextInputWithCounter/TextInputWithCounter'
import LoadingIndicator from '../../../../components/LoadingIndicator/LoadingIndicator'
import LinkList from '../timeline/LinkList'
import EditIcon from '../../../../assets/icons/icon-edit-black.svg'

import styles from './DesignOption.scss'

class DesignOption extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditMode: props.defaultData.__isNew || false,
      isSimulatedLinksUpdating: false,
      data: props.defaultData,
      isFormValid: true,
    }

    this.setEditMode = this.setEditMode.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onSave = this.onSave.bind(this)
    this.addLink = this.addLink.bind(this)
    this.updateLink = this.updateLink.bind(this)
    this.removeLink = this.removeLink.bind(this)
    this.updateField = this.updateField.bind(this)
    this.setFormInvalid = this.setFormInvalid.bind(this)
    this.setFormValid = this.setFormValid.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    // if server operation is successful, turn off edit mode
    if (this.props.isUpdating && !nextProps.isUpdating && !nextProps.error) {
      this.setEditMode(false)
      this.setState({
        data: nextProps.defaultData,
      })
    }
  }

  updateField(field, value) {
    this.setState({
      data: {
        ...this.state.data,
        [field]: value
      }
    })
  }

  setEditMode(editMode) {
    this.setState({
      isEditMode: editMode
    })
  }

  onCancel() {
    const {
      defaultData,
      id,
      onDelete,
    } = this.props

    this.setEditMode(false)

    // if we are adding a new option - remove it on Cancel
    if (defaultData.__isNew) {
      onDelete(id)

    // if we are editing already saved option - revert changes on Cancel
    } else {
      this.setState({
        data: defaultData,
      })
    }
  }

  onSave() {
    const { data } = this.state
    const {
      onSave,
      id,
    } = this.props

    onSave(id, data)
  }

  onDelete() {
    const {
      onDelete,
      id,
    } = this.props

    onDelete(id)
  }

  triggerLinksListEditClose() {
    this.setState({
      isSimulatedLinksUpdating: true,
    }, () => {
      this.setState({
        isSimulatedLinksUpdating: false,
      })
    })
  }

  addLink(values) {
    const {
      data: { links },
    } = this.state

    this.triggerLinksListEditClose()
    this.updateField('links', [...links, values])
  }

  updateLink(values, linkIndex) {
    const {
      data: { links },
    } = this.state

    this.triggerLinksListEditClose()
    this.updateField('links', [
      ...links.slice(0, linkIndex),
      values,
      ...links.slice(linkIndex + 1)
    ])
  }

  removeLink(linkIndex) {
    const {
      data: { links },
    } = this.state

    this.updateField('links', [
      ...links.slice(0, linkIndex),
      ...links.slice(linkIndex + 1)
    ])
  }

  setFormInvalid() {
    this.setState({
      isFormValid: false,
    })
  }

  setFormValid() {
    this.setState({
      isFormValid: true,
    })
  }

  render() {
    const {
      isEditMode,
      isSimulatedLinksUpdating,
      data,
      isFormValid,
    } = this.state
    const {
      isUpdating,
      isUpdatingAnyOption,
    } = this.props
    const {
      title,
      submissionId,
      previewUrl,
      links,
    } = data

    const isNew = data.__isNew

    return (
      <div styleName="container">
        {isUpdating && <div styleName="loading-overlay"><LoadingIndicator /></div>}

        <div styleName="columns">
          <div styleName="left-column">
            <div styleName="image-container">
              <img styleName="preview-img" src={previewUrl} />
            </div>
          </div>
          <div styleName="right-column">
            <Formsy.Form
              styleName="form-container"
              onInvalid={this.setFormInvalid}
              onValid={this.setFormValid}
            >
              {!isEditMode && (
                <i styleName="edit-btn" title="edit" onClick={() => this.setEditMode(true)}><EditIcon /></i>
              )}
              <TextInputWithCounter
                wrapperClass={`${styles['title-input']}`}
                label="Title"
                name="title"
                type="text"
                maxLength="64"
                disabled={!isEditMode || isUpdating}
                value={title}
                showCounter={isEditMode}
                onChange={this.updateField}
                validations={{
                  isRequired: true
                }}
                validationError="Title is required"
              />
              <TCFormFields.TextInput
                wrapperClass={`${styles['submission-id-input']}`}
                label="Submission Id"
                name="submissionId"
                type="number"
                disabled={!isEditMode || isUpdating}
                value={submissionId}
                onChange={this.updateField}
                validations={{
                  isRequired: true
                }}
                validationError="Submission Id is required"
              />
              <TCFormFields.TextInput
                wrapperClass={`${styles['preview-link-input']}`}
                label="Preview URL"
                name="previewUrl"
                type="text"
                disabled={!isEditMode || isUpdating}
                value={previewUrl}
                onChange={this.updateField}
                validations={{
                  isRelaxedUrl: true,
                }}
                validationErrors={{
                  isRelaxedUrl: 'Please enter a valid URL'
                }}
              />
            </Formsy.Form>

            <div styleName="links-wrapper">
              <div styleName="links-title">Presentation links</div>
              <LinkList
                links={links}
                onAddLink={!isUpdating ? this.addLink : undefined}
                onRemoveLink={isEditMode && !isUpdating ? this.removeLink : undefined}
                onUpdateLink={isEditMode && !isUpdating ? this.updateLink : undefined}
                fields={[{
                  name: 'title',
                  value: `Design ${links.length + 1}`,
                  maxLength: 64,
                }, {
                  name: 'url'
                }]}
                addButtonTitle="Add Link"
                formAddTitle="Add Link"
                formAddButtonTitle="Add Link"
                formUpdateTitle="Editing Link"
                formUpdateButtonTitle="Update"
                canAddLink={isEditMode}
                isUpdating={isSimulatedLinksUpdating}
              />
            </div>
          </div>
        </div>

        {isEditMode && (
          <div styleName="button-wrapper">
            {!isNew && (
              <button
                className="tc-btn tc-btn-warning tc-btn-sm action-btn"
                onClick={this.onDelete}
                disabled={isUpdatingAnyOption}
              >
                  Delete
              </button>
            )}
            <button
              className="tc-btn tc-btn-default tc-btn-sm action-btn"
              onClick={this.onCancel}
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button
              className="tc-btn tc-btn-primary tc-btn-sm action-btn"
              onClick={this.onSave}
              disabled={isUpdatingAnyOption || !isFormValid}
            >
              {isNew ? 'Save new' : 'Save changes'}
            </button>
          </div>
        )}
      </div>
    )
  }
}

DesignOption.propTypes = {
  id: PT.string.isRequired,
  defaultData: PT.shape({
    title: PT.string,
    submissionId: PT.string,
    previewUrl: PT.string,
    links: PT.arrayOf(PT.shape({
      title: PT.string,
      url: PT.string
    }))
  }).isRequired,
  onDelete: PT.func.isRequired,
  onSave: PT.func.isRequired
}

export default withRouter(DesignOption)
