/**
 * Profile settings form
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
import PhoneInput from 'appirio-tech-react-components/components/Formsy/PhoneInput'
import TimezoneInput from 'appirio-tech-react-components/components/Formsy/TimezoneInput'
import WorkingHoursSelection from 'appirio-tech-react-components/components/Formsy/WorkingHoursSelection'
const TCFormFields = FormsyForm.Fields
const Formsy = FormsyForm.Formsy
import ProfileSettingsAvatar from './ProfileSettingsAvatar'
import FormsySelect from '../../../../../components/Select/FormsySelect'
import ISOCountries from '../../../../../helpers/ISOCountries'
import { formatPhone } from '../../../../../helpers/utils'
import { hasPermission } from '../../../../../helpers/permissions'
import PERMISSIONS from '../../../../../config/permissions'
import './ProfileSettingsForm.scss'

const countries = _.orderBy(ISOCountries, ['name'], ['asc']).map((country) => ({
  label: country.name,
  value: country.name,
}))

class ProfileSettingsForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      valid: false,
      dirty: false,
      businessPhoneValid: true,
      countrySelected: null,
      businessPhoneDirty: false,
      countrySelectionDirty: false,
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onValid = this.onValid.bind(this)
    this.onInvalid = this.onInvalid.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onBusinessPhoneCountryChange = this.onBusinessPhoneCountryChange.bind(
      this
    )
    this.onCountryChange = this.onCountryChange.bind(this)

    this.hideCountrySelectAlert = this.hideCountrySelectAlert.bind(this)
    this.hideBusinessPhoneAlert = this.hideBusinessPhoneAlert.bind(this)
  }

  componentDidUpdate() {
    if (this.refs.form && !this.isValidated && this.props.shouldDoValidateOnStart) {
      this.refs.form.submit()
      this.isValidated = true
    }
  }

  onCountryChange(country) {
    // on country change, country code of business phone should change automatically
    if (
      country &&
      country.value &&
      this.state.countrySelected !== country.value
    ) {
      this.setState({
        countrySelected: country.value,
        countrySelectionDirty: true,
      })
    }
  }

  onBusinessPhoneCountryChange({ country, externalChange, isValid: isValidForApi }) {
    const { countrySelected: previousSelectedCountry } = this.state

    if (country && country.code) {
      if (previousSelectedCountry !== country.name && country.name) {
        // when country code of business phone changes, the country selection should change automatically
        this.refs.countrySelect.setValue(country.name)
        this.setState({
          countrySelected: country.name,
        })
      }
    }

    const isValid = isValidForApi && country && country.code
    if (!this.state.businessPhoneValid && isValid) {
      this.setState({
        businessPhoneValid: true,
      })
    } else if (this.state.businessPhoneValid && !isValid) {
      this.setState({
        businessPhoneValid: false,
      })
    }

    // external change means, the user didn't change the phone number field.
    // But it was automatically changed due to country selection change. In such case, we should show
    // the alert under country selection only.
    const countryName = country && country.name
    const countryCodeChanged =
      countryName &&
      previousSelectedCountry &&
      countryName !== previousSelectedCountry
    if (!externalChange && countryCodeChanged) {
      this.setState({
        businessPhoneDirty: true,
      })
    }
  }

  hideCountrySelectAlert() {
    this.setState({
      countrySelectionDirty: false,
    })
  }

  hideBusinessPhoneAlert() {
    this.setState({
      businessPhoneDirty: false,
    })
  }

  getField(label, name, isRequired = false, isDisabled = false) {
    let validations = null
    let validationErrors

    if (name === 'businessPhone') {
      validations = {
        // use same regexp as on server side
        matchRegexp: /^\+(?:[0-9] ?){6,14}[0-9]$/,
      }
    }

    if (name === 'businessEmail') {
      validations = {
        isEmail: true,
      }
      validationErrors = {
        isEmail: 'Please, enter correct email'
      }
    }

    return (
      <div className="field">
        <div className="label">
          <span styleName="fieldLabelText">{label}</span>&nbsp;
          {isRequired && <sup styleName="requiredMarker">*</sup>}
        </div>
        <TCFormFields.TextInput
          wrapperClass="input-field"
          type="text"
          name={name}
          validations={validations}
          value={this.props.values.settings[name] || ''}
          validationError={`Please, enter ${label}`}
          validationErrors={validationErrors}
          required={isRequired}
          disabled={isDisabled}
        />
      </div>
    )
  }

  onSubmit(data) {
    // we have to use initial data as a base for updated data
    // as form could update not all fields, thus they won't be included in `data`
    // for example user avatar is not included in `data` thus will be removed if don't use
    // this.props.values.settings as a base
    const updatedData = {
      ...this.props.values.settings,
      ...data,
    }

    updatedData.businessPhone = formatPhone(updatedData.businessPhone)
    this.props.saveSettings(updatedData)

    this.setState({
      businessPhoneDirty: false,
      countrySelectionDirty: false,
    })
  }

  onValid() {
    this.setState({ valid: true })
  }

  onInvalid() {
    this.setState({ valid: false })
  }

  onChange(currentValues, isChanged) {
    if (this.state.dirty !== isChanged) {
      this.setState({ dirty: isChanged })
    }
  }

  render() {
    const {
      showBusinessEmail,
      showAvatar,
      showCompanyName,
      showTitle,
      showBusinessPhone,
      isRequiredTimeZone,
      isRequiredCountry,
      isRequiredWorkingHours,
      isRequiredBusinessEmail,
      submitButton,
      showBackButton,
      onBack,
      shouldShowTitle,
      buttonExtraClassName,
    } = this.props

    const disablePhoneInput = this.props.values.settings.businessPhone && !hasPermission(PERMISSIONS.UPDATE_USER_PROFILE_PHONE)
    const disableCompanyInput = this.props.values.settings.companyName && !hasPermission(PERMISSIONS.UPDATE_USER_PROFILE_COMPANY)

    return (
      <Formsy.Form
        ref="form"
        className="profile-settings-form"
        onInvalid={this.onInvalid}
        onValid={this.onValid}
        onValidSubmit={this.onSubmit}
        onChange={this.onChange}
      >
        {shouldShowTitle && (<div className="section-heading">Personal information</div>)}
        {showAvatar && (
          <div className="field">
            <div className="label">Avatar</div>
            <ProfileSettingsAvatar
              user = {this.props.user}
              isUploading={this.props.values.isUploadingPhoto}
              photoUrl={this.props.values.settings.photoUrl}
              uploadPhoto={this.props.uploadPhoto}
            />
          </div>
        )}
        {this.getField('First Name', 'firstName', true)}
        {this.getField('Last Name', 'lastName', true)}
        {showTitle && this.getField('Title', 'title', true)}
        {showBusinessEmail &&
          this.getField('Business Email', 'businessEmail', isRequiredBusinessEmail)}
        {showBusinessPhone && (
          <div className="field">
            <div className="label">
              <span styleName="fieldLabelText">Business Phone</span>&nbsp;
              <sup styleName="requiredMarker">*</sup>
            </div>
            <div className="input-field">
              <PhoneInput
                validations={{
                  isValid: () => this.state.businessPhoneValid,
                }}
                ref="phoneInput"
                wrapperClass={'input-container'}
                name="businessPhone"
                type="phone"
                validationError="Invalid business phone"
                showCheckMark
                listCountry={ISOCountries}
                required
                forceCountry={this.state.countrySelected}
                value={
                  this.props.values.settings.businessPhone
                    ? this.props.values.settings.businessPhone
                    : ''
                }
                onChangeCountry={this.onBusinessPhoneCountryChange}
                onOutsideClick={this.hideBusinessPhoneAlert}
                disabled={disablePhoneInput}
              />
              {this.state.businessPhoneDirty && (
                <div styleName="warningText">
                  Note: Changing the country code also updates your country
                  selection
                </div>
              )}
            </div>
          </div>
        )}
        {showCompanyName &&
          this.getField(
            'Company name',
            'companyName',
            true,
            disableCompanyInput
          )}
        <div className="field">
          {isRequiredCountry ? (
            <div className="label">
              <span styleName="fieldLabelText">Country</span>&nbsp;
              <sup styleName="requiredMarker">*</sup>
            </div>
          ) : (
            <div className="label">
              <span styleName="fieldLabelText">Country</span>
            </div>
          )}
          <div className="input-field">
            <FormsySelect
              ref="countrySelect"
              name="country"
              value={
                this.props.values.settings.country
                  ? this.props.values.settings.country
                  : ''
              }
              options={countries}
              onChange={this.onCountryChange}
              placeholder="- Select country -"
              showDropdownIndicator
              setValueOnly
              onBlur={this.hideCountrySelectAlert}
              required={isRequiredCountry}
              validationError="Please enter Country"
            />
            {this.state.countrySelectionDirty && (
              <div styleName="warningText">
                Note: Changing the country also updates the country code of
                business phone.
              </div>
            )}
          </div>
        </div>
        <div className="field">
          {isRequiredTimeZone ? (
            <div className="label">
              <span styleName="fieldLabelText">Local Timezone</span>&nbsp;
              <sup styleName="requiredMarker">*</sup>
            </div>
          ) : (
            <div className="label">
              <span styleName="fieldLabelText">Local Timezone</span>
            </div>
          )}
          <div className="input-field">
            <TimezoneInput
              render={(timezoneOptions, filterFn) => (
                <FormsySelect
                  setValueOnly
                  filterOption={(option, searchText) =>
                    filterFn(option.data, searchText)
                  }
                  value={this.props.values.settings.timeZone || ''}
                  name="timeZone"
                  options={timezoneOptions}
                  required={isRequiredTimeZone}
                  validationError="Please enter Local Timezone"
                />
              )}
            />
          </div>
        </div>
        <div className="field">
          {isRequiredWorkingHours ? (
            <div className="label label-working-hours">
              <span styleName="fieldLabelText">Normal Working Hours</span>&nbsp;
              <sup styleName="requiredMarker">*</sup>
            </div>
          ) : (
            <div className="label label-working-hours">
              <span styleName="fieldLabelText">Normal Working Hours</span>
            </div>
          )}
          <div className="input-field">
            <WorkingHoursSelection
              startHourLabel="Start Time"
              endHourLabel="End Time"
              startHourName="workingHourStart"
              endHourName="workingHourEnd"
              startHourValue={this.props.values.settings.workingHourStart || ''}
              endHourValue={this.props.values.settings.workingHourEnd || ''}
              wrapperClass={'input-container'}
              // react-select package in react-components is old and not compatible with connect-app.
              // So, passing the FormsySelect component that uses newer version of react-select
              selectElement={FormsySelect}
              selectElementProps={{ setValueOnly: true }}
              isRequired={isRequiredWorkingHours}
            />
          </div>
        </div>
        <div className="controls">

          {showBackButton && (
            <button
              className={`tc-btn tc-btn-default btn-back ${buttonExtraClassName}`}
              onClick={(e) => {
                e.preventDefault()
                onBack()
              }}
            >
              Back
            </button>
          )}

          <button
            type="submit"
            className={`tc-btn tc-btn-primary ${buttonExtraClassName}`}
            disabled={
              this.props.values.pending ||
              !this.state.valid ||
              !this.state.dirty
            }
          >
            {submitButton}
          </button>
        </div>
      </Formsy.Form>
    )
  }
}

ProfileSettingsForm.defaultProps = {
  showBusinessEmail: false,
  showAvatar: true,
  showCompanyName: true,
  showTitle: true,
  showBusinessPhone: true,
  isRequiredTimeZone: true,
  isRequiredCountry: false,
  isRequiredWorkingHours: false,
  isRequiredBusinessEmail: true,
  showBackButton: false,
  submitButton: 'Save settings',
  onBack: () => {},
  shouldShowTitle: true,
  shouldDoValidateOnStart: false,
  buttonExtraClassName: '',
}

ProfileSettingsForm.propTypes = {
  values: PropTypes.object.isRequired,
  saveSettings: PropTypes.func.isRequired,
  uploadPhoto: PropTypes.func.isRequired,
  showBusinessEmail: PropTypes.bool,
  showAvatar: PropTypes.bool,
  showCompanyName: PropTypes.bool,
  showTitle: PropTypes.bool,
  showBusinessPhone: PropTypes.bool,
  isRequiredTimeZone: PropTypes.bool,
  isRequiredCountry: PropTypes.bool,
  isRequiredWorkingHours: PropTypes.bool,
  isRequiredBusinessEmail: PropTypes.bool,
  showBackButton: PropTypes.bool,
  shouldShowTitle: PropTypes.bool,
  shouldDoValidateOnStart: PropTypes.bool,
  submitButton: PropTypes.string,
  onBack: PropTypes.func,
  buttonExtraClassName: PropTypes.string,
}

export default ProfileSettingsForm
