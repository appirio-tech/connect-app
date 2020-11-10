/**
 * Dialog which shows incomplete user profile.
 */
import React from 'react'
import PT from 'prop-types'
import Modal from 'react-modal'
import IncompleteUserProfile from '../IncompleteUserProfile/IncompleteUserProfile'
import XMarkIcon from  '../../assets/icons/icon-x-mark.svg'
import styles from './IncompleteUserProfileDialog.scss'
import LoadingIndicator from '../LoadingIndicator/LoadingIndicator'

const IncompleteUserProfileDialog = ({
  onCloseDialog,
  title,
  ...restProps,
}) => {
  return (
    <Modal
      isOpen
      className="project-dialog-conatiner"
      overlayClassName="management-dialog-overlay incomplete-profile-dialog-overlay"
      onRequestClose={onCloseDialog}
      contentLabel=""
    >
      <div className={`project-dialog ${styles.dialog}`}>
        <div className="dialog-title">
          <h3>{title}</h3>
          <p styleName="subtitle">Complete your profile now.</p>
          <span onClick={onCloseDialog}><XMarkIcon /></span>
        </div>

        <div className={`dialog-body ${styles.body}`}>
          {restProps.profileSettings.pending && <div styleName="loadingOverlay"><LoadingIndicator /></div>}
          <IncompleteUserProfile
            {...restProps}
            submitButton="Save"
            buttonExtraClassName="tc-btn-md"
          />
        </div>
      </div>
    </Modal>
  )
}

IncompleteUserProfileDialog.propTypes = {
  profileSettings: PT.object.isRequired,
  saveProfileSettings: PT.func.isRequired,
  user: PT.object.isRequired,
  onCloseDialog: PT.func.isRequired,
  title: PT.string.isRequired,
}

export default IncompleteUserProfileDialog
