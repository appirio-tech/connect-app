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
      <div styleName={cn('container', theme)}>
        {!isEditing && (
          <div styleName="label-layer">
            <span styleName={cn('title', type)}>
              {link.title || ''}
            </span>

            <div styleName="link-wrapper">
              {link.isDownloadable ? (
                <a
                  href={link.url}
                  download={link.url}
                  styleName="milestone-text"
                >
                  {link.url}
                </a>
              ) : (
                <a
                  href={link.url}
                  styleName="milestone-text"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.url}
                </a>
              )}
            </div>

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

LinkItem.defaultProps = {
  milestoneType: 'only-text',
  image: require('../../../../../assets/icons/timeline-invoice.svg'),
  milestonePostLink: '',
  label: '',
  isHideDot: false,
}

LinkItem.propTypes = {
  label: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool,
  milestoneType: PT.string,
  image: PT.string,
  milestonePostLink: PT.string,
  isHideDot: PT.bool,
  deleteLink: PT.func
}

export default LinkItem
