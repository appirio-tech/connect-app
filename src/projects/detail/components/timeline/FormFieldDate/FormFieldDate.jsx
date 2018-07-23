/**
 * Date form field type
 *
 * Shows a pair of dates.
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields

import styles from './FormFieldDate.scss'

const FormFieldDate = ({ startDate, endDate, theme }) => {
  const startDateProps = _.omit(startDate, 'label')
  startDateProps.type = 'date'
  startDateProps.wrapperClass = styles['field-wrapper']

  const endDateProps = _.omit(endDate, 'label')
  endDateProps.type = 'date'
  endDateProps.wrapperClass = styles['field-wrapper']

  return (
    <div styleName={cn('milestone-post', theme)}>
      <div styleName="col-left">
        <label styleName="label-title">{startDate.label}</label>
      </div>
      <div styleName="col-right">
        <TCFormFields.TextInput {...startDateProps} />
        <label styleName="label-title">{endDate.label}</label>
        <TCFormFields.TextInput {...endDateProps} />
      </div>
    </div>
  )
}

FormFieldDate.defaultProps = {
  theme: '',
}

FormFieldDate.propTypes = {
  endDate: PT.shape({
    label: PT.string.isRequired,
    name: PT.string.isRequired,
    value: PT.string,
  }),
  startDate: PT.shape({
    label: PT.string.isRequired,
    name: PT.string.isRequired,
    value: PT.string,
  }),
  theme: PT.string,

}

export default FormFieldDate
