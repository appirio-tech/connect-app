/**
 * Profile settings form
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields
const Formsy = FormsyForm.Formsy
import ProfileSeetingsAvatar from './ProfileSeetingsAvatar'
import './ProfileSettingsForm.scss'

const companySizeRadioOptions = ['1-15', '16-50', '51-500', '500+']

class ProfileSettingsForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      settings: {...this.props.values.settings},
      valid: false
    }
    this.onFieldUpdate = this.onFieldUpdate.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onValid = this.onValid.bind(this)
    this.onInvalid = this.onInvalid.bind(this)
  }

  onFieldUpdate(name, value) {
    const settings = {...this.state.settings,
      [name]: value
    }
    this.setState({ settings })
  }

  getField(label, name, isRequired=false) {
    let validations = null
    if (name === 'businessPhone') {
      validations = {
        matchRegexp: /^([+]?\d{1,2}[.-\s]?)?(\d{3}[.-]?){2}\d{4}$/
      }
    }
    return (
      <div className="field">
        <div className="label">{label}</div>
        <TCFormFields.TextInput
          wrapperClass="input-field"
          type="text"
          name={name}
          validations={validations}
          onChange={this.onFieldUpdate}
          value={this.state.settings[name] || ''}
          validationError={`Please enter ${label}`}
          required={isRequired}
        />
      </div>
    )
  }

  onSubmit() {
    this.props.saveSettings(this.state.settings)
  }

  onValid() {
    this.setState({valid: true})
  }

  onInvalid() {
    this.setState({valid: false})
  }

  render() {
    return (
      <Formsy.Form
        className="profile-settings-form"
        onInvalid={this.onInvalid}
        onValid={this.onValid}
        onValidSubmit={this.onSubmit}
      >
        <div className="section-heading">Personal information</div>
        <div className="field">
          <div className="label">Avatar</div>
          <ProfileSeetingsAvatar
            isUploading={this.props.values.isUploadingPhoto}
            photoUrl={this.state.settings.photoUrl}
            uploadPhoto={this.props.uploadPhoto}
          />
        </div>
        {this.getField('First and last name', 'firstNLastName', true)}
        {this.getField('Title', 'title', true)}
        {this.getField('Business phone', 'businessPhone', true)}
        {this.getField('Company name', 'companyName', true)}
        <div className="field">
          <div className="label">Company size</div>
          <TCFormFields.RadioGroup
            wrapperClass="input-field"
            type="text"
            name="companySize"
            value={this.state.settings.companySize}
            onChange={this.onFieldUpdate}
            options={companySizeRadioOptions.map((label) => ({option: label, label, value: label}))}
            required
          />
        </div>
        <div className="section-heading">Business address</div>
        {this.getField('Address', 'address')}
        {this.getField('City', 'city')}
        <div className="field">
          <div className="label">State</div>
          <div className="zip-container">
            <TCFormFields.TextInput
              wrapperClass="input-field"
              type="text"
              name="state"
              onChange={this.onFieldUpdate}
              value={this.state.settings.state || ''}
            />
            <div className="zip label">ZIP</div>
            <TCFormFields.TextInput wrapperClass="input-field zip-input"
              type="text" maxLength={5} name="zip" value={this.state.settings.zip || ''}
              onChange={this.onFieldUpdate}
            />
          </div>
        </div>
        {this.getField('Country', 'country')}
        <div className="controls">
          <button
            type="submit"
            className="tc-btn tc-btn-primary"
            disabled={this.props.values.pending || !this.state.valid}
          >
            Save settings
          </button>
        </div>
      </Formsy.Form>
    )
  }
}

ProfileSettingsForm.propTypes = {
  values: PropTypes.object.isRequired,
  saveSettings: PropTypes.func.isRequired,
  uploadPhoto: PropTypes.func.isRequired
}

export default ProfileSettingsForm
