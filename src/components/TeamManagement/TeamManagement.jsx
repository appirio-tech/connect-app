import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import uncontrollable from 'uncontrollable'
import './TeamManagement.scss'
import MemberRow from './MemberRow'
import Panel from '../Panel/Panel'
import DeleteModal from './DeleteModal'
import OwnerModal from './OwnerModal'
import AddTeamMember from './AddTeamMember'
import NewMemberConfirmModal from './NewMemberConfirmModal'
import Join from './Join'
import MobileExpandable from '../MobileExpandable/MobileExpandable'
import { PROJECT_ROLE_MANAGER, PROJECT_ROLE_CUSTOMER } from '../../config/constants'
const userShape = PropTypes.shape({
  userId: PropTypes.number.isRequired,
  handle: PropTypes.string.isRequired,
  photoURL: PropTypes.string,
  role: PropTypes.string,
  isPrimary: PropTypes.bool,
  isManager: PropTypes.bool,
  isCopilot: PropTypes.bool,
  isCustomer: PropTypes.bool
})


/**
 * Function to help sort the order in which members are displayed
 */
const calcMemberPriority = m => {
  let priority = 0
  if (m.role === PROJECT_ROLE_CUSTOMER) priority += 5
  if (m.role === PROJECT_ROLE_MANAGER) priority += 2

  if (m.isPrimary) priority++
  return -priority
}

const TeamManagement = (props) => {
  const {
    currentUser, members, deletingMember, isAddingTeamMember, onMemberDeleteConfirm, onMemberDelete, isShowJoin,
    newOwner, onChangeOwner, onChangeOwnerConfirm, onToggleAddTeamMember, showNewMemberConfirmation, onAddNewMember,
    onToggleNewMemberConfirm, onKeywordChange
  } = props
  const currentMember = members.filter((member) => member.userId === currentUser.userId)[0]
  const owner = members.filter((member) => member.isPrimary && member.isCustomer)[0]
  const modalActive = isAddingTeamMember || deletingMember || isShowJoin || showNewMemberConfirmation
  const canJoin = !currentMember && (currentUser.isCopilot || currentUser.isManager)

  const sortedMembers = _.sortBy(members, [(member) => {
    return calcMemberPriority(member)
  }])

  const _onAddNewMember = () => {
    onToggleNewMemberConfirm(false)
    onAddNewMember()
  }
  const _onAddMemberCancel = () => {
    onKeywordChange('')
    onToggleNewMemberConfirm(false)
  }
  return (
    <div className="team-management">
      <MobileExpandable title={`PROJECT TEAM (${members.length})`}>
        <Panel className={cn({'modal-active': modalActive})}>
          {(currentMember || currentUser.isAdmin) && <Panel.AddBtn onClick={() => onToggleAddTeamMember(true)}>Add Team Member</Panel.AddBtn>}

          {modalActive && <div className="modal-overlay" />}
          <Panel.Title>
            Project Team ({members.length})
          </Panel.Title>

          {sortedMembers.map((member) => {
            const _onConfirmDelete = () => {
              onMemberDeleteConfirm(member)
              onMemberDelete(null)
            }

            const _onConfirmOwnerChange = () => {
              onChangeOwnerConfirm(member)
              onChangeOwner(null)
            }
            const _onMemberDeleteCancel = () => onMemberDelete(null)
            const _onChangeOwnerCancel = () => onChangeOwner(null)
            if (deletingMember && deletingMember.userId === member.userId) {
              return (
                <DeleteModal
                  {...member}
                  isLeave={currentMember === member}
                  key={member.userId}
                  onCancel={_onMemberDeleteCancel}
                  onConfirm={_onConfirmDelete}
                />
              )
            }
            if (newOwner && newOwner.userId === member.userId) {
              return (
                <OwnerModal
                  key="ownerModal"
                  member={member}
                  onCancel={_onChangeOwnerCancel}
                  onConfirm={_onConfirmOwnerChange}
                />
              )
            }
            return (
              <MemberRow
                key={member.userId}
                onMemberDelete={onMemberDelete}
                onChangeOwner={onChangeOwner}
                currentMember={currentMember}
                member={member}
                currentUser={currentUser}
              />
            )
          })}

          {canJoin && <Join {...props} isCopilot={currentUser.isCopilot} owner={owner} />}
          {(currentMember || currentUser.isAdmin) && <AddTeamMember {...props} owner={owner} />}

          { showNewMemberConfirmation && <NewMemberConfirmModal onConfirm={ _onAddNewMember } onCancel={ _onAddMemberCancel } />}
          {(currentMember || currentUser.isAdmin) && (
            <div className="add-member-mobile">
              <button className="tc-btn tc-btn-secondary tc-btn-md" onClick={() => onToggleAddTeamMember(true)}>Add Team Member</button>
            </div>
          )}
        </Panel>
      </MobileExpandable>
    </div>
  )
}

TeamManagement.propTypes = {
  /**
   * The current logged in user in the app.
   * Used to determinate "You" label and access
   */
  currentUser: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    isManager: PropTypes.bool,
    isCopilot: PropTypes.bool
  }).isRequired,

  /**
   * The error message
   */
  error: PropTypes.string,

  /**
   * The list of all project members
   */
  members: PropTypes.arrayOf(userShape).isRequired,

  /**
   * The list of matching users in "add ad team member"
   */
  searchMembers: PropTypes.arrayOf(userShape),

  /**
   * The selected user from searchMembers
   */
  selectedNewMember: userShape,

  /**
   * Callback fired when member is selected from the list
   *
   * function (
   *  User member,
   *  SyntheticEvent event?
   * )
   */
  onSelectNewMember: PropTypes.func.isRequired,

  /**
   * Callback fired when "Add" button is clicked
   *
   * function (
   *  SyntheticEvent event?
   * )
   */
  onAddNewMember: PropTypes.func.isRequired,

  /**
   * The flag if "add ad team member" form is visible
   */
  isAddingTeamMember: PropTypes.bool,

  /**
   * Callback fired when "add a team member" is shown/hidden
   *
   * function (
   *  Bool visible,
   *  SyntheticEvent event?
   * )
   */
  onToggleAddTeamMember: PropTypes.func.isRequired,

  /**
   * The search keyword in "Add a team member"
   */
  keyword: PropTypes.string,

  /**
   * Callback fired when a keyword is updated "add a team member"
   *
   * function (
   *  String keyword,
   *  SyntheticEvent event?
   * )
   */
  onKeywordChange: PropTypes.func.isRequired,

  /**
   * The current deleting member. When defined a confirmation overlay will be displayed
   */
  deletingMember: PropTypes.object,

  /**
   * Callback fired if member delete must be confirmed
   * If confirmation is cancelled, member will be null
   *
   * function (
   *  User? member,
   *  SyntheticEvent event?
   * )
   */
  onMemberDelete: PropTypes.func.isRequired,

  /**
   * Callback fired when delete is confirmed
   *
   * function (
   *  User member,
   *  SyntheticEvent event?
   * )
   */
  onMemberDeleteConfirm: PropTypes.func.isRequired,

  /**
   * The new owner member. When defined a confirmation overlay will be displayed
   */
  newOwner: PropTypes.object,

  /**
   * Callback fired if new owner must be confirmed
   * If confirmation is cancelled, newOwner will be null
   *
   * function (
   *  User? newOwner,
   *  SyntheticEvent event?
   * )
   */
  onChangeOwner: PropTypes.func.isRequired,

  /**
   * Callback fired when owner is confirmed
   *
   * function (
   *  User newOwner,
   *  SyntheticEvent event?
   * )
   */
  onChangeOwnerConfirm: PropTypes.func.isRequired,

  /**
   * The flag if join confirmation is visible
   *
   * function (
   *  SyntheticEvent event?
   * )
   */
  isShowJoin: PropTypes.bool,

  /**
   * Callback fired when join confirmation popup is toggled
   *
   * function (
   *  Boolean isShowJoin,
   *  SyntheticEvent event?
   * )
   */
  onJoin: PropTypes.func.isRequired,

  /**
   * Callback fired when user confirmed join
   *
   * function (
   *  SyntheticEvent event?
   * )
   */
  onJoinConfirm: PropTypes.func.isRequired,

  /**
   * The selected filter type
   */
  filterType: PropTypes.string,

  /**
   * Callback fired when filter type is changed
   *
   * function (
   *  String filterType,
   *  SyntheticEvent event?
   * )
   */
  onFilterTypeChange: PropTypes.func.isRequired
}


export default uncontrollable(TeamManagement, {
  deletingMember: 'onMemberDelete',
  isShowJoin: 'onJoin',
  newOwner: 'onChangeOwner'
})
