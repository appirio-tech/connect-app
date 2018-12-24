import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import _ from 'lodash'
import {
  ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN,
  PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER, PROJECT_ROLE_CUSTOMER,
  AUTOCOMPLETE_TRIGGER_LENGTH
} from '../../../config/constants'
import TeamManagement from '../../../components/TeamManagement/TeamManagement'
import { addProjectMember, updateProjectMember, removeProjectMember,
  loadMemberSuggestions, loadMemberProfileForSuggestions
} from '../../actions/projectMember'


class TeamManagementContainer extends Component {

  constructor(props) {
    super(props)
    this.onKeywordChange = this.onKeywordChange.bind(this)
    this.onKeywordPaste = this.onKeywordPaste.bind(this)
    this.onSelectNewMember = this.onSelectNewMember.bind(this)
    this.onAddNewMember = this.onAddNewMember.bind(this)
    this.onToggleAddTeamMember = this.onToggleAddTeamMember.bind(this)
    this.onMemberDeleteConfirm = this.onMemberDeleteConfirm.bind(this)
    this.onJoinConfirm = this.onJoinConfirm.bind(this)
    this.onChangeOwnerConfirm = this.onChangeOwnerConfirm.bind(this)
    this.onFilterTypeChange = this.onFilterTypeChange.bind(this)
    this.onToggleNewMemberConfirm = this.onToggleNewMemberConfirm.bind(this)
  }

  componentWillMount() {
    this.setState({
      isUserLeaving: false,
      searchMembers: [],
      keyword: '',
      isAddingTeamMember: false,
      filterType: PROJECT_ROLE_CUSTOMER
    })
  }

  componentWillReceiveProps(nextProps) {
    const { keyword, isAddingTeamMember } = this.state
    if (isAddingTeamMember && keyword.length)
      this.updateSearchMembers(nextProps)
    if (this.state.isUserLeaving &&
      _.findIndex(nextProps.members,
        m => m.userId === this.props.currentUser.userId) === -1
    ) {
      // navigate to project listing
      this.props.history.push('/projects/')
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Trigger a resize event to make sure all <Sticky> nodes update their sizes
    // whenever isAddingTeamMember is toggled.
    if (prevState.isAddingTeamMember !== this.state.isAddingTeamMember) {
      // We use requestAnimationFrame because this function may be executed before
      // the DOM elements are actually drawn.
      // Source: http://stackoverflow.com/a/28748160
      requestAnimationFrame(() => {
        const event = document.createEvent('HTMLEvents')
        event.initEvent('resize', true, false)
        window.dispatchEvent(event)
      })
    }
  }

  updateSearchMembers({allMembers, members}) {
    const {keyword, selectedNewMember } = this.state
    if (!keyword || !keyword.trim().length) {
      return []
    }
    const searchMembers = allMembers.filter((user) => {
      if (members.some((member) => member.userId === user.userId)) {
        // return false
      }
      // if (currentUser.isCustomer && !user.isCustomer) {
      //   return false
      // }
      // if (currentUser.isCopilot && user.isManager) {
      //   return false
      // }
      // if (currentUser.isManager || currentUser.isCopilot) {
      //   if (filterType === 'member' && !user.isCustomer) {
      //     return false
      //   }
      //   if (filterType === 'copilot' && user.isCustomer) {
      //     return false
      //   }
      // }
      if (selectedNewMember && selectedNewMember.userId === user.userId) {
        return false
      }
      return user.handle.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
    })
    this.setState({
      searchMembers,
      error: this.getError({keyword, searchMembers, selectedNewMember})
    })
  }

  getError({keyword, searchMembers, selectedNewMember}) {
    if (!selectedNewMember && keyword && keyword.trim().length && !searchMembers.length) {
      return 'This username doesn’t exist on Topcoder.'
    }
    return null
  }

  onKeywordChange(keyword) {
    if (keyword.length >= AUTOCOMPLETE_TRIGGER_LENGTH)
      this.props.loadMemberSuggestions(keyword)
    this.setState({ keyword, selectedNewMember: null })
  }

  onKeywordPaste(keyword) {
    if (keyword && keyword.length > AUTOCOMPLETE_TRIGGER_LENGTH) {
      this.props.loadMemberProfileForSuggestions(keyword)
      this.setState({ keyword, selectedNewMember: null })
    }
  }

  onSelectNewMember(selectedNewMember) {
    const keyword = selectedNewMember ? selectedNewMember.handle : ''
    const { members } = this.props
    let error = null
    if (selectedNewMember && members.some((member) => member.userId === selectedNewMember.userId)) {
      error = keyword + ' is already part of your team.'
    }
    this.setState({ selectedNewMember, keyword,
      error
    })
  }

  onAddNewMember() {
    const { filterType, selectedNewMember } = this.state
    const userId = selectedNewMember.userId
    this.props.addProjectMember(
      this.props.projectId, {
        userId,
        role: _.isEmpty(filterType) ? PROJECT_ROLE_CUSTOMER: filterType
      }
    )
    this.setState({
      keyword: '',
      searchMembers: [],
      selectedNewMember: null
    })
  }

  onToggleAddTeamMember(isAddingTeamMember) {
    this.setState({ isAddingTeamMember, error : null, searchMembers: [] })
  }

  onToggleNewMemberConfirm(showNewMemberConfirmation) {
    this.setState({ showNewMemberConfirmation, isAddingTeamMember : false })
  }

  onMemberDeleteConfirm(member) {
    // is user leaving current project
    const isLeaving = member.userId === this.props.currentUser.userId
    this.props.removeProjectMember(this.props.projectId, member.id, isLeaving)
    this.setState({ isUserLeaving: isLeaving })
  }

  onJoinConfirm() {
    const { currentUser, projectId, addProjectMember } = this.props
    const role = currentUser.isCopilot ? PROJECT_ROLE_COPILOT : PROJECT_ROLE_MANAGER
    addProjectMember(
      projectId,
      { userId: currentUser.userId, role }
    )
  }

  onFilterTypeChange(filterType) {
    this.setState({ filterType })
  }

  onChangeOwnerConfirm(member) {
    this.props.updateProjectMember(this.props.projectId, member.id, { role: member.role, isPrimary: true })
  }

  anontateMemberProps() {
    const { members, allMembers } = this.props
    // fill project members from state.members object
    return _.map(members, m => {
      if (!m.userId) return m
      // map role
      switch (m.role) {
      case PROJECT_ROLE_COPILOT:
        m.isCopilot = true
        break
      case PROJECT_ROLE_CUSTOMER:
        m.isCustomer = true
        m.isPrimary = m.isPrimary || false
        break
      case PROJECT_ROLE_MANAGER:
        m.isManager = true
        break
      }
      return _.assign({}, m, {
        photoURL: ''
      },
      _.find(allMembers, mem => mem.userId === m.userId))
    })
  }

  render() {
    const projectMembers = this.anontateMemberProps()
    return (
      <div>
        <TeamManagement
          {...this.state}
          currentUser={this.props.currentUser}
          members={projectMembers}
          onKeywordChange={this.onKeywordChange}
          onKeywordPaste={this.onKeywordPaste}
          onSelectNewMember={this.onSelectNewMember}
          onAddNewMember={this.onAddNewMember}
          onToggleNewMemberConfirm={ this.onToggleNewMemberConfirm }
          onToggleAddTeamMember={this.onToggleAddTeamMember}
          onMemberDeleteConfirm={this.onMemberDeleteConfirm}
          onJoinConfirm={this.onJoinConfirm}
          onChangeOwnerConfirm={this.onChangeOwnerConfirm}
          onFilterTypeChange={this.onFilterTypeChange}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ loadUser, members }) => {
  const adminRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]
  const powerUserRoles = [ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER, ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]
  const managerRoles = [ ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN, ROLE_CONNECT_MANAGER ]
  return {
    currentUser: {
      userId: parseInt(loadUser.user.id),
      isCopilot: _.indexOf(loadUser.user.roles, ROLE_CONNECT_COPILOT) > -1,
      isAdmin: _.intersection(loadUser.user.roles, adminRoles).length > 0,
      isManager: loadUser.user.roles.some((role) => managerRoles.indexOf(role) !== -1),
      isCustomer: !loadUser.user.roles.some((role) => powerUserRoles.indexOf(role) !== -1)
    },
    allMembers: _.values(members.members)
  }
}

const mapDispatchToProps = {
  addProjectMember,
  removeProjectMember,
  updateProjectMember,
  loadMemberSuggestions,
  loadMemberProfileForSuggestions,
}

TeamManagementContainer.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    isManager: PropTypes.bool,
    isCustomer: PropTypes.bool,
    isCopilot: PropTypes.bool
  }).isRequired,
  allMembers: PropTypes.arrayOf(PropTypes.object).isRequired,
  projectId: PropTypes.number.isRequired
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamManagementContainer))
