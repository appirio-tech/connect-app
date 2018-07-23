import React from 'react'
import PT from 'prop-types'

import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
import MilestonePostEditLink from '../MilestonePostEditLink'
import MilestonePostEditLinkDropDown from '../MilestonePostEditLinkDropDown'
import MilestonePostEditDate from '../MilestonePostEditDate'

import './Form.scss'

class Form extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isValid: false,
    }

    this.setFormValid = this.setFormValid.bind(this)
    this.setFormInvalid = this.setFormInvalid.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }

  setFormValid() {
    this.setState({ isValid: true })
  }

  setFormInvalid() {
    this.setState({ isValid: false })
  }

  submitForm(values) {
    const { onSubmit } = this.props

    onSubmit(values)
  }

  render() {
    const {
      cancelButtonTitle,
      fields,
      onCancelClick,
      submitButtonTitle,
      title,
    } = this.props
    const { isValid } = this.state

    return (
      <Formsy.Form
        styleName="form"
        onInvalid={this.setFormInvalid}
        onValid={this.setFormValid}
        onValidSubmit={this.submitForm}
      >
        <div styleName="title">{title}</div>
        <div styleName="rows">
          {fields.map((field) => {
            switch(field.type) {
            case 'text':
            case 'textarea':
              return (
                <MilestonePostEditLink {...field} key={field.name} />
              )
            case 'date':
              return (
                <MilestonePostEditDate {...field} key={field.name} />
              )
            case 'select':
              return (
                <MilestonePostEditLinkDropDown {...field} key={field.name} />
              )
            default:
              return null
            }
          })}
        </div>

        <div styleName="actions">
          <button
            type="button"
            onClick={onCancelClick}
            className="tc-btn tc-btn-default"
          >
            {cancelButtonTitle}
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className="tc-btn tc-btn-primary"
          >
            {submitButtonTitle}
          </button>
        </div>
      </Formsy.Form>
    )
  }
}

Form.defaultProps = {
  cancelButtonTitle: 'Cancel',
  submitButtonTitle: 'Submit',
}

Form.propTypes = {
  cancelButtonTitle: PT.string,
  fields: PT.arrayOf(PT.shape({
    name: PT.string.isRequired,
    value: PT.string,
  })).isRequired,
  onCancelClick: PT.func.isRequired,
  onSubmit: PT.func.isRequired,
  submitButtonTitle: PT.string,
  title: PT.string.isRequired,
}

export default Form
