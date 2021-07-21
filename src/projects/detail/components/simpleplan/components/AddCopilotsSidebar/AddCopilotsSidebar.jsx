import React from 'react'
import PT from 'prop-types'
import uncontrollable from 'uncontrollable'
import { PERMISSIONS } from '../../../../../../config/permissions'
import { hasPermission } from '../../../../../../helpers/permissions'
import Select from '../../../../../../components/Select/Select'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import {getAvatarResized, getFullNameWithFallback} from '../../../../../../helpers/tcHelpers'
import IconXMark from '../../../../../../assets/icons/x-mark-thin.svg'

import './AddCopilotsSidebar.scss'

function AddCopilotsSidebar({
  memberToAdd,
  setMemberToAdd,
  copilots,
  projectMembers,
  onClose,
  onAdd,
  onRemove
})  {
  const canManageCopilots = hasPermission(PERMISSIONS.MANAGE_COPILOTS)
  const canRemoveCopilots = hasPermission(PERMISSIONS.REMOVE_COPILOTS)

  const projectMemberOptions = projectMembers.map(projectMember => ({
    label: projectMember.handle,
    value: projectMember
  })).filter(option => copilots.indexOf(option.value) === -1)

  return (
    <aside styleName="add-copilots-sidebar">
      <h2 styleName="title">
        Copilot
        <button type="button" className="tc-btn tc-btn-link" styleName="button-close" onClick={onClose}>
          <IconXMark />
        </button>
      </h2>
      <div styleName="select-copilot">
        <span styleName="label">Add New Copilot</span>
        <Select
          options={projectMemberOptions}
          onChange={(selectedOption) => {
            if (!selectedOption) {
              return
            }

            setMemberToAdd(selectedOption.value)
          }}
          value={projectMemberOptions.find(option => option.value === memberToAdd) || null}
          placeholder="- Select -"
          isClearable={false}
        />
        <button
          className="tc-btn tc-btn-primary tc-btn-sm"
          onClick={() => {
            onAdd(memberToAdd)
            setMemberToAdd(null)
          }}
          disabled={!memberToAdd}
          styleName="add-button"
        >
          ADD
        </button>
      </div>
      <ul styleName="copilot-list">
        {copilots.map((member, index) => (
          <li key={`${member.handle}-${index}`}>
            <div styleName="member-details">
              <Avatar
                userName={getFullNameWithFallback(member)}
                avatarUrl={getAvatarResized(_.get(member, 'photoURL') || '', 80)}
                size={40}
              />
              <div styleName="name-and-handle">
                <span styleName="fullname">{getFullNameWithFallback(member)}</span>
                <span styleName="handle">
                  @{member.handle || 'ConnectUser'}
                </span>
              </div>
              {(canManageCopilots || canRemoveCopilots) && (
                <button
                  className="tc-btn tc-btn-link"
                  styleName="close-button"
                  onClick={() => {
                    onRemove(member)
                  }}
                >
                  &times;
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}

AddCopilotsSidebar.propTypes = {
  copilots: PT.arrayOf(PT.shape()),
  projectMembers: PT.arrayOf(PT.shape()),
  onClose: PT.func,
  onAdd: PT.func,
  onRemove: PT.func,
}

export default uncontrollable(AddCopilotsSidebar, {
  memberToAdd: 'setMemberToAdd'
})
