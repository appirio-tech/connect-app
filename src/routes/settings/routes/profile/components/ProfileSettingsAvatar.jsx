/**
 * Profile avatar settings
 */
import React from 'react'
import PropTypes from 'prop-types'
import FileBtn from '../../../../../components/FileBtn/FileBtn'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import { getFullNameWithFallback, getAvatarResized } from '../../../../..//helpers/tcHelpers'
import './ProfileSettingsAvatar.scss'

class ProfileSettingsAvatar extends React.Component {
  constructor(props) {
    super(props)
    this.onFileChange = this.onFileChange.bind(this)
  }

  onFileChange(evt) {
    const { uploadPhoto } = this.props
    if (evt.target.files && evt.target.files.length > 0) {
      const file = evt.target.files[0]
      uploadPhoto(file)
    }
  }

  render() {
    const { isUploading, user } = this.props
    const userName = getFullNameWithFallback(user)
    const label = isUploading ? 'Uploading, please wait' : 'Upload a new photo'
    return (
      <div className="profile-settings-avatar">
        <div styleName="avatar" >
          <Avatar avatarUrl={getAvatarResized(user.photoURL || '', 160)} userName={userName} size={80}/>
        </div>
        <div className="controls">
          <FileBtn
            label={label}
            onChange={this.onFileChange}
            accept="image/*"
            disabled={isUploading}
          />
        </div>
      </div>
    )
  }
}

ProfileSettingsAvatar.propTypes = {
  photoURL: PropTypes.string,
  isUploading: PropTypes.bool,
  uploadPhoto: PropTypes.func,
}

export default ProfileSettingsAvatar
