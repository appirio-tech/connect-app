/**
 * Profile settings form
 */
import React, { PropTypes } from 'react'
import { Formsy, TCFormFields } from 'appirio-tech-react-components'
import SVGIconImage from '../../../../../components/SVGIconImage'
import TextInputWithCounter from '../../../../../components/TextInputWithCounter/TextInputWithCounter'
import ProfileSeetingsAvatar from './ProfileSeetingsAvatar'
import { MAX_USERNAME_LENGTH } from '../../../../../config/constants'
import './ProfileSettingsForm.scss'

const ProfileSettingsForm = (props) => {
  const { username, photoSrc, firstname, lastname, company, mobilephone1, mobilephone2 } = props

  return (
    <Formsy.Form
      className="profile-settings-form"
      onValidSubmit={props.onSubmit}
    >
      <ProfileSeetingsAvatar defaultPhotoSrc={photoSrc}/>

      <div className="field">
        <div className="username">
          <div className="username-icon"><SVGIconImage filePath="users-16px_single-01" /></div>
          <TextInputWithCounter type="text" name="username" label="Username" value={username} maxLength={`${MAX_USERNAME_LENGTH}`} />
        </div>
      </div>

      <div className="field">
        <TCFormFields.TextInput type="text" name="firstname" label="First name" value={firstname} />
      </div>

      <div className="field">
        <TCFormFields.TextInput type="text" name="lastname" label="Last name" value={lastname} />
      </div>

      <div className="field">
        <TCFormFields.TextInput type="text" name="company" label="Company" value={company} />
      </div>

      <div className="field">
        <TCFormFields.TextInput type="phone" name="mobilephone1" label="Mobile phone" value={mobilephone1} />
      </div>

      <div className="field">
        <TCFormFields.TextInput type="phone" name="mobilephone2" label="Mobile phone" value={mobilephone2} />
      </div>

      <div className="controls">
        <button type="submit" className="tc-btn tc-btn-primary">Save settings</button>
      </div>
    </Formsy.Form>
  )
}

ProfileSettingsForm.propTypes = {
  username: PropTypes.string,
  photoSrc: PropTypes.string,
  firstname: PropTypes.string,
  lastname: PropTypes.string,
  company: PropTypes.string,
  mobilephone1: PropTypes.string,
  mobilephone2: PropTypes.string,
  onSubmit: PropTypes.func
}

export default ProfileSettingsForm
