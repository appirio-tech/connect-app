import React from 'react'
import _ from 'lodash'

import Form from '../Form'
import { MILESTONE_LINK_SUPPORTED_TYPES } from '../../../../../config/constants'

import './LinkItemForm.scss'

const POSSIBLE_FIELDS = [{
  label: 'Title',
  placeholder: 'Title',
  name: 'title',
  value: '',
  type: 'text',
  validations: {
    isRequired: true
  },
  validationError: 'Title is required',
}, {
  label: 'URL',
  placeholder: 'URL',
  name: 'url',
  value: '',
  type: 'text',
  validations: {
    isRelaxedUrl: true,
    isRequired: true
  },
  validationError: 'URL is required',
  validationErrors: {
    isRelaxedUrl: 'Please enter a valid URL'
  }
}, {
  label: 'Type',
  placeholder: 'Type',
  name: 'type',
  value: '',
  type: 'select',
  options: [...MILESTONE_LINK_SUPPORTED_TYPES]
}]

const LinkItemForm = ({
  fields,
  onCancelClick,
  onSubmit,
  submitButtonTitle,
  title,
}) => {
  const allowedFields = []

  POSSIBLE_FIELDS.forEach((defaultField) => {
    const allowedField = _.find(fields, { name: defaultField.name })

    if (!allowedField) {
      return
    }

    allowedFields.push({
      ...defaultField,
      ...allowedField,
    })
  })

  return (
    <Form
      fields={allowedFields}
      onCancelClick={onCancelClick}
      onSubmit={onSubmit}
      submitButtonTitle={submitButtonTitle}
      title={title}
    />
  )
}

LinkItemForm.defaultProps = {
}

LinkItemForm.propTypes = {
}

export default LinkItemForm
