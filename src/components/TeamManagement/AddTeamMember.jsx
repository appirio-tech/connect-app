import React, {PropTypes} from 'react'
import AutoCompleteInput from './AutoCompleteInput'
// import MemberAutoSuggest from './MemberAutoSuggest'
import cn from 'classnames'
import { Icons } from 'appirio-tech-react-components'


const { IconUsersAdd, XMarkIcon } = Icons

const AddTeamMember = (props) => {
  const {
    isAddingTeamMember, onAddNewMember, onToggleAddTeamMember, onKeywordChange, selectedNewMember, error,
    filterType, currentUser, onFilterTypeChange
  } = props
  const onTypeChangeCustomer = () => onFilterTypeChange('customer')
  const onTypeChangeCopilot = () => onFilterTypeChange('copilot')
  const onBtnClose = () => {
    onKeywordChange('')
    onToggleAddTeamMember(false)
  }
  const onConfirmAddMember = () => {
    onAddNewMember()
    onToggleAddTeamMember(false)
  }
  const showAddMember = () => { onToggleAddTeamMember(true)}
  if (isAddingTeamMember) {
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
                disabled={!selectedNewMember}
                onClick={onConfirmAddMember}
              >Add</button>
          </div>
          {error && <p className="error-message">
            {error}
          </p>}
          {(currentUser.isManager || currentUser.isCopilot) && <div className="tab-group">
            <ul>
              <li className={cn({active: filterType === 'customer'})}>
                <a href="javascript:" onClick={onTypeChangeCustomer}>Member</a>
              </li>
              <li className={cn({active: filterType === 'copilot'})}>
                <a href="javascript:" onClick={onTypeChangeCopilot}>Copilot</a>
              </li>
            </ul>
          </div>}
        </div>
      </div>
    )
  }
  return (
    <div className="panel-row add-team-member" onClick={showAddMember}>
      <div className="add-icon"><IconUsersAdd className="add-icon"/></div>
      <div className="profile">Add a team member</div>
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
