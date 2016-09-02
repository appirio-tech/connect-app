import React from 'react'
import TeamManagement from '../../components/TeamManagement/TeamManagement'


/*
 * Mock container
 * Should be replaced by redux store
 *
 * Role mapping required:
 * isCopilot: ROLE_TOPCODER_COPILOT
 * isManager: ROLE_MANAGER
 * isCustomer: only 1 role: ROLE_TOPCODER_USER
 */


const allUsers = [
  {
    userId: 1,
    handle: 'christina_underwood',
    firstName: 'Christina',
    lastName: 'Underwood',
    photoURL: require('../i/profile1.jpg'),
    isPrimary: true,
    isCustomer: true
  },
  {
    userId: 2,
    handle: 'cp-superstar',
    firstName: 'Corrie',
    lastName: 'Page',
    photoURL: require('../i/profile3.jpg'),
    isCopilot: true
  },
  {
    userId: 3,
    handle: 'pat_monahan',
    firstName: 'Patrick',
    lastName: 'Monahan',
    photoURL: require('../i/profile4.jpg'),
    isManager: true
  },
  {
    userId: 10, handle: 'user1', firstName: 'user', lastName: '1', photoURL: require('../i/profile1.jpg'), isCustomer: true
  },
  {
    userId: 11, handle: 'user2', firstName: 'user', lastName: '2', photoURL: require('../i/profile2.jpg'), isCustomer: true
  },
  {
    userId: 12, handle: 'user3', firstName: 'user', lastName: '3', photoURL: require('../i/profile3.jpg'), isCustomer: true
  },
  {
    userId: 13, handle: 'user4', firstName: 'user', lastName: '4', photoURL: require('../i/profile4.jpg'), isCustomer: true
  },
  {
    userId: 14, handle: 'user5', firstName: 'user', lastName: '5', photoURL: require('../i/profile5.jpg'), isCustomer: true
  },
  {
    userId: 15, handle: 'user6', firstName: 'user', lastName: '6', photoURL: require('../i/profile6.jpg'), isCustomer: true
  },
  {
    userId: 21, handle: 'copilot1', firstName: 'copilot', lastName: '1', photoURL: require('../i/profile1.jpg'), isCopilot: true
  },
  {
    userId: 22, handle: 'copilot2', firstName: 'copilot', lastName: '2', photoURL: require('../i/profile2.jpg'), isCopilot: true
  },
  {
    userId: 23, handle: 'copilot3', firstName: 'copilot', lastName: '3', photoURL: require('../i/profile3.jpg'), isCopilot: true
  },
  {
    userId: 31, handle: 'manager 1', firstName: 'manager', lastName: '1', photoURL: require('../i/profile4.jpg'), isManager: true
  },
  {
    userId: 32, handle: 'manager2', firstName: 'manager', lastName: '2', photoURL: require('../i/profile5.jpg'), isManager: true
  }
]


export default class TeamManagementContainer extends React.Component {

  constructor(props) {
    super(props)
    const {currentUserIndex, memberIndexes} = props
    this.state = {
      currentUser: allUsers[currentUserIndex],
      members: memberIndexes.map((idx) => allUsers[idx]),
      searchMembers: [],
      keyword: '',
      isAddingTeamMember: false,
      filterType: 'member'
    }
    this.onKeywordChange = this.onKeywordChange.bind(this)
    this.onSelectNewMember = this.onSelectNewMember.bind(this)
    this.onAddNewMember = this.onAddNewMember.bind(this)
    this.onToggleAddTeamMember = this.onToggleAddTeamMember.bind(this)
    this.onMemberDeleteConfirm = this.onMemberDeleteConfirm.bind(this)
    this.onJoinConfirm = this.onJoinConfirm.bind(this)
    this.onChangeOwnerConfirm = this.onChangeOwnerConfirm.bind(this)
    this.onFilterTypeChange = this.onFilterTypeChange.bind(this)
  }

  onKeywordChange(keyword) {
    const selectedNewMember = null
    const searchMembers = this.getSearchMembers({...this.state, keyword, selectedNewMember})
    const error = this.getError({searchMembers, keyword})
    this.setState({keyword, searchMembers, selectedNewMember, error})
  }

  onSelectNewMember(selectedNewMember) {
    const keyword = selectedNewMember ? selectedNewMember.handle : ''
    const searchMembers = this.getSearchMembers({...this.state, selectedNewMember, keyword})
    this.setState({selectedNewMember, searchMembers, keyword})
  }

  onAddNewMember() {
    this.setState({
      members: [...this.state.members, this.state.selectedNewMember],
      keyword: '',
      selectedNewMember: null,
      isAddingTeamMember: false
    })
  }

  onToggleAddTeamMember(isAddingTeamMember) {
    this.setState({isAddingTeamMember})
  }

  onMemberDeleteConfirm(member) {
    this.setState({
      members: this.state.members.filter((item) => item !== member)
    })
  }

  onJoinConfirm() {
    this.setState({
      members: [...this.state.members, this.state.currentUser]
    })
  }

  onFilterTypeChange(filterType) {
    const searchMembers = this.getSearchMembers({...this.state, filterType})
    const error = this.getError({...this.state, searchMembers})
    this.setState({filterType, searchMembers, error})
  }

  onChangeOwnerConfirm(member) {
    const members = this.state.members
      .map((item) => ({...item, isPrimary: item.userId === member.userId}))
    this.setState({
      members
    })
  }

  getSearchMembers({keyword, members, selectedNewMember, filterType}) {
    if (!keyword || !keyword.trim().length) {
      return []
    }
    const {currentUser} = this.state
    return allUsers.filter((user) => {
      if (members.some((member) => member.userId === user.userId)) {
        return false
      }
      if (currentUser.isCustomer && !user.isCustomer) {
        return false
      }
      if (currentUser.isCopilot && user.isManager) {
        return false
      }
      if (currentUser.isManager || currentUser.isCopilot) {
        if (filterType === 'member' && !user.isCustomer) {
          return false
        }
        if (filterType === 'copilot' && user.isCustomer) {
          return false
        }
      }
      if (selectedNewMember && selectedNewMember.userId === user.userId) {
        return false
      }
      return user.handle.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
    })
  }
  
  getError({keyword, searchMembers, selectedNewMember}) {
    if (!selectedNewMember && keyword && keyword.trim().length && !searchMembers.length) {
      return 'This handle doesn’t exist on Topcoder.'
    }
    return null
  }
  
  render() {
    return (
      <div>
        <TeamManagement
          {...this.state}
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
