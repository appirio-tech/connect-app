/**
 * Profile avatar settings
 */
import React from 'react'
import PropTypes from 'prop-types'
import FileBtn from '../../../../../components/FileBtn/FileBtn'
import './ProfileSeetingsAvatar.scss'

class ProfileSeetingsAvatar extends React.Component {
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
    const { photoUrl, isUploading } = this.props
    const label = isUploading ? 'Uploading, please wait' : 'Upload a new photo'
    return (
      <div className="profile-settings-avatar">
        <img className="photo" src={photoUrl} />
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

ProfileSeetingsAvatar.propTypes = {
  photoUrl: PropTypes.string,
  isUploading: PropTypes.bool,
  uploadPhoto: PropTypes.func
}

export default ProfileSeetingsAvatar
