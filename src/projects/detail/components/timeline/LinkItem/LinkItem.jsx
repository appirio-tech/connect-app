/**
 * Link item which can display static link or link with edit/delete buttons
 *
 *
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import LinkItemForm from '../LinkItemForm'

import { MILESTONE_LINK_SUPPORTED_TYPES } from '../../../../../config/constants'

import './LinkItem.scss'

class LinkItem extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false,
    }

    this.closeEditForm = this.closeEditForm.bind(this)
    this.openEditForm = this.openEditForm.bind(this)
    this.closeEditForm = this.closeEditForm.bind(this)
    this.updateLink = this.updateLink.bind(this)
    this.deleteLink = this.deleteLink.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { isUpdating } = this.props
    const { isEditing } = this.state

    if (isEditing && isUpdating && !nextProps.isUpdating) {
      this.closeEditForm()
    }
  }

  updateLink(values) {
    const { updateLink, itemId } = this.props

    updateLink(values, itemId)
  }

  deleteLink() {
    const { deleteLink, itemId } = this.props

    deleteLink(itemId)
  }

  openEditForm() {
    this.setState({ isEditing: true })
  }

  closeEditForm() {
    this.setState({ isEditing: false })
  }

  onSelectChange(evt) {
    const { onSelectChange, itemId } = this.props
    const isSelected = evt.target.checked

    onSelectChange(isSelected, itemId)
  }

  render() {
    const {
      fields,
      link,
      formUpdateButtonTitle,
      formUpdateTitle,
      deleteLink,
      updateLink,
      onSelectChange,
      theme,
    } = this.props
    const { isEditing } = this.state

    const fieldsWithValues = fields ? fields.map((field) => ({
      ...field,
      value: this.props.link[field.name]
    })) : []

    const supportedTypes = _.map(MILESTONE_LINK_SUPPORTED_TYPES, 'value')
    // fallback to no-type if type is not supported to avoid errors due to lack of styles
    const type = _.includes(supportedTypes, link.type) ? link.type : ''

    return (
      <div
        styleName={cn(
          'container',
          theme, {
            'is-selected': !!onSelectChange && link.isSelected,
            'has-title': !!link.title,
          }
        )}
      >
        {!isEditing && (
          <div styleName="label-layer">
            <div styleName="link-item-text-group">
              <a
                href={link.url}
                styleName={cn('title', type)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.title || ''}
              </a>

              <div styleName="link-wrapper">
                {link.isDownloadable ? (
                  <a
                    href={link.url}
                    download={link.url}
                    styleName="link"
                  >
                    {link.url}
                  </a>
                ) : (
                  <a
                    href={link.url}
                    styleName="link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.url}
                  </a>
                )}
              </div>
            </div>
            <div styleName="link-item-button-group">
              {!!updateLink && (
                <span onClick={this.openEditForm} styleName="button edit" />
              )}

              {!!deleteLink && (
                <span onClick={this.deleteLink} styleName="button delete" />
              )}

              {!!link.isDownloadable && !updateLink && !deleteLink && !onSelectChange && (
                <a
                  href={link.url}
                  download={link.url}
                  styleName="button download"
                />
              )}

              {!!onSelectChange && (
                <div styleName="col-wrapper">
                  <label styleName="checkbox-ctrl">
                    <input
                      type="checkbox"
                      styleName="checkbox"
                      onChange={this.onSelectChange}
                    />
                    <span styleName="checkbox-text" />
                  </label>
                </div>
              )}

              {!onSelectChange && link.isSelected && (
                <div styleName="col-wrapper">
                  <span styleName="item-checked" />
                </div>
              )}
            </div>
          </div>
        )}

        {isEditing && (
          <LinkItemForm
            fields={fieldsWithValues}
            onCancelClick={this.closeEditForm}
            onSubmit={this.updateLink}
            submitButtonTitle={formUpdateButtonTitle}
            title={formUpdateTitle}
          />
        )}
      </div>
    )
  }
}

LinkItem.propTypes = {
  /** fields which will be rendered by LinkItemForm, see POSSIBLE_FIELDS for all possibilities */
  fields: PT.arrayOf(PT.shape({
    name: PT.string.isRequired,
    value: PT.string,
  })),

  /** link object */
  link: PT.shape({
    title: PT.string,
    type: PT.oneOf(_.map(MILESTONE_LINK_SUPPORTED_TYPES, 'value')),
    url: PT.string.isRequired,
    isSelected: PT.bool,
  }),

  /** this will passed to updateLink/deleteLink handlers */
  itemId: PT.number,

  /** title of edit link form */
  formUpdateTitle: PT.string,

  /** main button text of the edit link form */
  formUpdateButtonTitle: PT.string,

  /** delete link handler */
  deleteLink: PT.func,

  /** update link handler */
  updateLink: PT.func,

  /** indicates if link is updating by one of the handlers */
  isUpdating: PT.bool,

  /** select/deselect link callback */
  onSelectChange: PT.func,
}

export default LinkItem
