import React from 'react'
import PT from 'prop-types'
import ReactDOM from 'react-dom'
import uncontrollable from 'uncontrollable'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import { AUTOCOMPLETE_TRIGGER_LENGTH } from '../../config/constants'
import UserIcon from  '../../assets/icons/username-icon.svg'
import { getAvatarResized } from '../../helpers/tcHelpers'


class AutoCompleteInput extends React.Component {

  constructor(props) {
    super(props)
    this.onClickOutside = this.onClickOutside.bind(this)
  }

  componentDidMount() {
    document.addEventListener('click', this.onClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickOutside)
  }

  onClickOutside(e) {
    const {onToggleSearchPopup} = this.props
    if (e.target === ReactDOM.findDOMNode(this.refs.input)) {
      return
    }
    onToggleSearchPopup(false, e)
  }

  render() {
    const {
      isPopupVisible, searchMembers, keyword, onKeywordChange, onSelectNewMember, onToggleSearchPopup,
      selectedNewMember, onKeywordPaste
    } = this.props

    const renderMember = (member, i) => {
      const onClick = (e) => {
        ReactDOM.findDOMNode(this.refs.input).focus()
        onSelectNewMember(member, e)
      }

      return (
        <div
          onClick={onClick}
          className="dropdown-cell"
          key={i}
        >
          <Avatar size={30} avatarUrl={getAvatarResized(member.photoURL, 30)} userName={member.firstName ? (member.firstName + ' ' + member.lastName) : 'Connect user'} />
          <div className="handle">{member.handle}</div>
        </div>
      )
    }
    const _onKeywordChange = e => onKeywordChange(e.target.value)
    const _onKeywordPaste = e => {
      e.stopPropagation()
      e.preventDefault()
      return onKeywordPaste(e.clipboardData.getData('Text'))
    }
    const _onToggleSearchPopup = () => onToggleSearchPopup(true)
    return (
      <div className="input-icon-group tc-file-field__inputs">

        {isPopupVisible && keyword.length >= AUTOCOMPLETE_TRIGGER_LENGTH && searchMembers.length > 0 &&
          <div className="member-dropdown">
            {searchMembers.map(renderMember)}
          </div>
        }

        <div className="input-icon">
          {selectedNewMember
            ? <Avatar size={30} avatarUrl={getAvatarResized(selectedNewMember.photoURL, 30)} userName={selectedNewMember.firstName ? (selectedNewMember.firstName + ' ' + selectedNewMember.lastName) : 'Connect user'} />
            : <UserIcon/>
          }
        </div>
        <input
          autoFocus
          ref="input"
          value={keyword}
          className="tc-file-field__inputs"
          type="text"
          placeholder="username"
          onPaste={_onKeywordPaste}
          onChange={_onKeywordChange}
          onClick={_onToggleSearchPopup}
          onKeyUp={_onToggleSearchPopup}
        />
      </div>
    )
  }
}

AutoCompleteInput.propTypes = {
  searchMembers: PT.array,
  keyword: PT.string,
  isPopupVisible: PT.bool,
  onKeywordChange: PT.func,
  onSelectNewMember: PT.func,
  onToggleSearchPopup: PT.func
}

export default uncontrollable(AutoCompleteInput, {
  isPopupVisible: 'onToggleSearchPopup'
})
