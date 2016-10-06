import React, {PropTypes} from 'react'

const DeleteFeatureModal = ({ feature, onCancel, onConfirm }) => {
  const deleteFeature = () => {
    onConfirm(feature)
  }
  return (
    <div className="modal">
      <div className="modal-title danger flex center">
        Are you sure you want to delete { feature.title }?
      </div>
      <div className="modal-body">
        <p className="message center">
          This will permanently remove  the feature from your project. This action cannot be undone.
        </p>

        <div className="button-area flex center">
          <button className="tc-btn tc-btn-default tc-btn-sm btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="tc-btn tc-btn-warning tc-btn-sm" onClick={ deleteFeature }>Delete Custom Feature</button>
        </div>
      </div>
    </div>
  )
}

DeleteFeatureModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  feature: PropTypes.object.isRequired
}

export default DeleteFeatureModal
