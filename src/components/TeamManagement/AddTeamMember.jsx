import React, {PropTypes} from 'react'
import AutoCompleteInput from './AutoCompleteInput'
import cn from 'classnames'
import { Icons } from 'appirio-tech-react-components'
import { PROJECT_ROLE_CUSTOMER } from '../../config/constants'


const { XMarkIcon } = Icons

const AddTeamMember = (props) => {
  const {
    isAddingTeamMember, onAddNewMember, onToggleAddTeamMember, onKeywordChange, selectedNewMember, error,
    filterType, currentUser, onFilterTypeChange, onToggleNewMemberConfirm, owner
  } = props
  const onTypeChangeCustomer = () => onFilterTypeChange('customer')
  const onTypeChangeCopilot = () => onFilterTypeChange('copilot')
  const onBtnClose = () => {
    onKeywordChange('')
    onToggleAddTeamMember(false)
  }
  const onConfirmAddMember = () => {
    // if adding a customer and there is no owner yet for the project
    if(filterType === PROJECT_ROLE_CUSTOMER && !owner) {
      onToggleNewMemberConfirm(true)
      return
    }
    onAddNewMember()
    onToggleAddTeamMember(false)
  }

  if (!isAddingTeamMember) {
    return null
  }
  return (
    <div className="modal add-team-member">
      <a href="javascript:" className="btn-close" onClick={onBtnClose}>
        <XMarkIcon />
      </a>
      <div className="modal-title title-muted">
        Add a Team Member
      </div>
      <div className="modal-body">
        <div className="modal-inline-form">
          <AutoCompleteInput {...props} />
          <button
            className="tc-btn tc-btn-primary tc-btn-md"
            disabled={!selectedNewMember || error}
            onClick={onConfirmAddMember}
          >Add
          </button>
        </div>
        {error && <p className="error-message">
          {error}
        </p>}
        {(currentUser.isManager || currentUser.isCopilot) && <div className="tab-group">
          <ul>
            <li className={cn({active: filterType === 'customer'})} onClick={onTypeChangeCustomer}>
              Member
            </li>
            <li className={cn({active: filterType === 'copilot'})} onClick={onTypeChangeCopilot}>
              Copilot
            </li>
          </ul>
        </div>}
      </div>
    </div>
  )
}

AddTeamMember.propTypes = {
  error: PropTypes.string,
  isAddingTeamMember: PropTypes.bool,
  selectedNewMember: PropTypes.object,
  onToggleAddTeamMember: PropTypes.func.isRequired,
  onKeywordChange: PropTypes.func.isRequired,
  onAddNewMember: PropTypes.func.isRequired
}

export default AddTeamMember
