import React from 'react'
import PropTypes from 'prop-types'
import { values } from 'lodash'

import './UserAutoComplete.scss'
import Select from '../Select/Select'

/**
 * Render a searchable dropdown for selecting users
 * @param {Object} projectMembers - a map of userId to user object of project members. i.e., members.members from the store
 * @param {String} selectedUsers - currently selected user handles delimitted by ','
 * @param {Function} onUpdate - change handler. invoked when a user is added or removed from selection
 */
const UserAutoComplete = ({
  projectMembers,
  selectedUsers,
  onUpdate,
  loggedInUser
}) => (
  <div styleName="user-select-wrapper" className="user-select-wrapper">
    <Select
      isMulti
      closeMenuOnSelect
      showDropdownIndicator={true}
      createOption={false}
      placeholder="Enter user handles"
      value={selectedUsers}
      onChange={selectedOptions => onUpdate(selectedOptions.map(option => option.value).join(','))}
      options={
        values(projectMembers || {})
          .filter(member => member.handle !== loggedInUser.handle)
          .map(member => ({ value: member.handle, label: member.handle }))
      }
    />
  </div>
)

UserAutoComplete.propTypes = {
  projectMembers: PropTypes.object,
  selectedUsers: PropTypes.string,
  onUpdate: PropTypes.func,
  loggedInUser: PropTypes.object
}

export default UserAutoComplete
