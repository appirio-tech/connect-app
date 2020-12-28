/**
 * Date form field type
 *
 * Shows a pair of dates.
 */
import React from 'react'
import PT from 'prop-types'

import FormsyForm from 'appirio-tech-react-components/components/Formsy'
import './FormFieldDate.scss'
const TCFormFields = FormsyForm.Fields


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
  theme: PT.string,

}

export default FormFieldDate
