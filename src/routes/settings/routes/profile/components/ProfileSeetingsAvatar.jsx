/**
 * Profile avatar settings
 */
import React, { PropTypes } from 'react'
import FileBtn from '../../../../../components/FileBtn/FileBtn'
import Alert from 'react-s-alert'
import './ProfileSeetingsAvatar.scss'

class ProfileSeetingsAvatar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      photoSrc: props.defaultPhotoSrc
    }

    this.onFileChange = this.onFileChange.bind(this)
  }

  onFileChange(evt) {
    if (evt.target.files && evt.target.files.length > 0) {
      const file = evt.target.files[0]

      // for browsers which don't restrict file type by accept param
      if (!file.type.match(/image\/*/)) {
        Alert.error('Please, choose an image of type jpeg or png.')
        return
      }

      const reader = new FileReader()

      reader.onload = (e) => {
        this.setState({ photoSrc: e.target.result })
      }

      reader.readAsDataURL(file)
    }
  }

  render() {
    const { photoSrc } = this.state

    return (
      <div className="profile-settings-avatar">
        <div className="label">Your Avatar</div>
        <img className="photo" src={photoSrc} />
        <div className="controls">
          <FileBtn onChange={this.onFileChange} accept="image/*"/>
        </div>
      </div>
    )
  }
}

ProfileSeetingsAvatar.propTypes = {
  defaultPhotoSrc: PropTypes.string
}

export default ProfileSeetingsAvatar
