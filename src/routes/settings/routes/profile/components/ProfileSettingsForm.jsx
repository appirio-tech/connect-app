/**
 * Profile settings form
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields
const Formsy = FormsyForm.Formsy
import ProfileSettingsAvatar from './ProfileSettingsAvatar'
import './ProfileSettingsForm.scss'

const companySizeRadioOptions = ['1-15', '16-50', '51-500', '500+']

class ProfileSettingsForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      valid: false,
      dirty: false,
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onValid = this.onValid.bind(this)
    this.onInvalid = this.onInvalid.bind(this)
    this.onChange = this.onChange.bind(this)
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
          value={this.props.values.settings[name] || ''}
          validationError={`Please enter ${label}`}
          required={isRequired}
        />
      </div>
    )
  }

  onSubmit(data) {
    // we have to use initial data as a base for updated data
    // as form could update not all fields, thus they won't be included in `data`
    // for example user avatar is not included in `data` thus will be removed if don't use 
    // this.props.values.settings as a base
    const updatedDate = {
      ...this.props.values.settings,
      ...data,
    }
    this.props.saveSettings(updatedDate)
  }

  onValid() {
    this.setState({valid: true})
  }

  onInvalid() {
    this.setState({valid: false})
  }

  onChange(currentValues, isChanged) {
    if (this.state.dirty !== isChanged) {
      this.setState({ dirty: isChanged })
    }
  }

  render() {
    return (
      <Formsy.Form
        className="profile-settings-form"
        onInvalid={this.onInvalid}
        onValid={this.onValid}
        onValidSubmit={this.onSubmit}
        onChange={this.onChange}
      >
        <div className="section-heading">Personal information</div>
        <div className="field">
          <div className="label">Avatar</div>
          <ProfileSettingsAvatar
            isUploading={this.props.values.isUploadingPhoto}
            photoUrl={this.props.values.settings.photoUrl}
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
            value={this.props.values.settings.companySize}
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
              value={this.props.values.settings.state || ''}
            />
            <div className="zip label">ZIP</div>
            <TCFormFields.TextInput wrapperClass="input-field zip-input"
              type="text" maxLength={5} name="zip" value={this.props.values.settings.zip || ''}
              onChange={this.onFieldUpdate}
            />
          </div>
        </div>
        {this.getField('Country', 'country')}
        <div className="controls">
          <button
            type="submit"
            className="tc-btn tc-btn-primary"
            disabled={this.props.values.pending || !this.state.valid || !this.state.dirty}
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
