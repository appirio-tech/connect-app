/**
 * Number form field type
 *              
 */
import React from 'react'

import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields

import './FormFieldNumber.scss'

const FormFieldNumber = (props) => {

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

export default FormFieldNumber