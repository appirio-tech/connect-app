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

const FormFieldDate = (props) => {

  return (
    <div styleName="milestone-post">
      <div styleName="col-left">
        <label styleName="label-title">{props.label}</label>
      </div>
      <div styleName="col-right">
        <TCFormFields.TextInput {...props} />
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
