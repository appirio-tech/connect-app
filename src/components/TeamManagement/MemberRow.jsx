import React, {PropTypes} from 'react'
import cn from 'classnames'
import { Icons, Avatar } from 'appirio-tech-react-components'

const ActionBtn = (props) => {
  let icon
  switch (props.type) {
  case 'user-remove':
    icon = <Icons.IconUsersDelete />
    break
  case 'leave':
    icon = <Icons.IconLeave />
    break
  case 'promote':
    icon = <Icons.IconArrowPriorityHigh />
    break
  }
  return (
    <button {...props} type="button" className={`btn-${props.type}`}>{icon}</button>
  )
}

const MemberRow = ({ member, currentMember, currentUser, onMemberDelete, onChangeOwner }) => {
  let title
  // rendered member
  const isOwner = member.isPrimary && member.isCustomer
  // current logged in user
  const isCurrentOwner = currentMember && currentMember.isPrimary && currentMember.isCustomer
  const titleClasses = { title: true }

  if (isOwner) {
    title = 'Owner'
  } else if (member.isCopilot) {
    title = 'Copilot'
    titleClasses.highlight = true
  } else if (member.isManager) {
    title = 'Manager'
    titleClasses.highlight = true
  }
  const onDelete = (e) => onMemberDelete(member, e)
  const buttons = []
  if (member === currentMember) {
    // owner and copilot can't leave project
    if (!isCurrentOwner && !member.isCopilot) {
      buttons.push(<ActionBtn key={0} type="leave" title="Leave Project" onClick={onDelete} />)
    }
  } else if (currentMember || currentUser.isAdmin) {
    // owner can remove only customers
    if (isCurrentOwner && member.isCustomer) {
      buttons.push(<ActionBtn key={1} type="user-remove" title="Remove team member from project" onClick={onDelete} />)
    }

    // manager can remove all except owner
    if ((currentMember && currentMember.isManager) || currentUser.isAdmin) {
      let tooltip = 'Remove team member from project'
      if (member.isCopilot) {
        tooltip = 'Remove copilot from project'
      }
      if (member.isManager) {
        tooltip = 'Remove manager from project'
      }
      if (member.isCustomer && isOwner) {
        tooltip = 'Remove owner from project'
      }
      buttons.push(<ActionBtn key={2} type="user-remove" title={tooltip} onClick={onDelete} />)
    }

    const canAssignOwner = isCurrentOwner || member.isManager
    // can assign owner to customers
    if (canAssignOwner && !isOwner && member.isCustomer) {
      const onClick = (e) => onChangeOwner(member, e)
      const tooltip = 'Assign member as owner'
      buttons.push(<ActionBtn key={3} type="promote" title={tooltip} onClick={onClick} />)
    }
  }

  return (
    <div className="panel-row">
      <Avatar avatarUrl={member.photoURL} userName={`${member.firstName} ${member.lastName}`}   />
      <div className="profile">
        <span className="name">{member.firstName} {member.lastName}</span>
        {member === currentMember && <span className="self"> (you) </span>}
        <span className="handle">{member.handle}</span>
      </div>
      {buttons.length ? <div><div className={cn(titleClasses)}>{title}</div><div className="buttons">{buttons}</div></div> : <div className={cn(titleClasses)}>{title}</div>}
    </div>
  )
}

MemberRow.propTypes = {
  member: PropTypes.object.isRequired,
  currentMember: PropTypes.object,
  onChangeOwner: PropTypes.func.isRequired,
  onMemberDelete: PropTypes.func.isRequired
}

export default MemberRow
