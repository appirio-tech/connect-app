import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import {
  ROLE_CONNECT_COPILOT, ROLE_CONNECT_MANAGER,
  PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER, PROJECT_ROLE_CUSTOMER
} from '../../../config/constants'
import TeamManagement from '../../../components/TeamManagement/TeamManagement'
import { addProjectMember, updateProjectMember, removeProjectMember,
  loadMemberSuggestions
} from '../../actions/projectMember'


class TeamManagementContainer extends Component {

  constructor(props) {
    super(props)
    this.onKeywordChange = this.onKeywordChange.bind(this)
    this.onSelectNewMember = this.onSelectNewMember.bind(this)
    this.onAddNewMember = this.onAddNewMember.bind(this)
    this.onToggleAddTeamMember = this.onToggleAddTeamMember.bind(this)
    this.onMemberDeleteConfirm = this.onMemberDeleteConfirm.bind(this)
    this.onJoinConfirm = this.onJoinConfirm.bind(this)
    this.onChangeOwnerConfirm = this.onChangeOwnerConfirm.bind(this)
    this.onFilterTypeChange = this.onFilterTypeChange.bind(this)
  }

  componentWillMount() {
    this.setState({
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
  }

  updateSearchMembers({allMembers, members}) {
    const {keyword, selectedNewMember } = this.state
    if (!keyword || !keyword.trim().length) {
      return []
    }
    const searchMembers = allMembers.filter((user) => {
      if (members.some((member) => member.userId === user.userId)) {
        return false
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
    if (keyword.length > 2)
      this.props.loadMemberSuggestions(keyword)
    this.setState({ keyword, selectedNewMember: null })
  }

  onSelectNewMember(selectedNewMember) {
    const keyword = selectedNewMember ? selectedNewMember.handle : ''
    this.setState({ selectedNewMember, keyword})
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
      selectedNewMember: null
    })

  }

  onToggleAddTeamMember(isAddingTeamMember) {
    this.setState({isAddingTeamMember})
  }

  onMemberDeleteConfirm(member) {
    this.props.removeProjectMember(this.props.projectId, member.id)
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
    // const members = this.state.members
    //   .map((item) => ({...item, isPrimary: item.userId === member.userId}))
    // this.setState({ members })
    this.props.updateProjectMember(this.props.projectId, member.id, { role: member.role, isPrimary: true })
  }

  render() {
    return (
      <div>
        <TeamManagement
          {...this.state}
          currentUser={this.props.currentUser}
          members={this.props.members}
          onKeywordChange={this.onKeywordChange}
          onSelectNewMember={this.onSelectNewMember}
          onAddNewMember={this.onAddNewMember}
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
  return {
    currentUser: {
      userId: parseInt(loadUser.user.id),
      isCopilot: _.indexOf(loadUser.user.roles, ROLE_CONNECT_COPILOT) > -1,
      isManager: _.indexOf(loadUser.user.roles, ROLE_CONNECT_MANAGER) > -1,
      isCustomer: _.indexOf(loadUser.user.roles, ROLE_CONNECT_MANAGER) === -1
        && _.indexOf(loadUser.user.roles, ROLE_CONNECT_COPILOT) === -1
    },
    allMembers: _.values(members.members)
  }
}

const mapDispatchToProps = {
  addProjectMember,
  removeProjectMember,
  updateProjectMember,
  loadMemberSuggestions
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

export default connect(mapStateToProps, mapDispatchToProps)(TeamManagementContainer)
