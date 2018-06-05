import React from 'react'
import PT from 'prop-types'
import './MilestonePostEditLinkDropDown.scss'

class MilestonePostEditLinkDropDown extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      currentCount: 0,
      isShowDropDownList: false
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.chooseItem = this.chooseItem.bind(this)
    this.toggleDropdownList = this.toggleDropdownList.bind(this)
  }

  /**use for update value for input text */
  onValueChange (event) {
    event.stopPropagation()
  }

  chooseItem (event) {
    this.toggleDropdownList()
    this.setState({value: event.target.innerHTML})
    this.props.onChange(event.target.innerHTML)
  }

  toggleDropdownList() {
    this.setState({isShowDropDownList: !this.state.isShowDropDownList})
  }

  render() {
    const props = this.props
    const title = props.title ? props.title : 'Title'
    return (
      <div styleName={'milestone-post ' 
      + (props.theme ? props.theme : '')
      }
      >
        <div styleName="label-layer">
          <div styleName={'label-title ' + props.titleExtraStyle}>{title}</div>
          <input onClick={this.toggleDropdownList} type="text" onChange={this.onValueChange} value={this.state.value}  placeholder={'title'} readOnly/>
          <span onClick={this.toggleDropdownList} />
          {this.state.isShowDropDownList && ( <div styleName={'dropdow-list ' + props.titleExtraStyle}>
            <ul>
              <li onClick={this.chooseItem}> ZIP FILE </li>
              <li onClick={this.chooseItem}> PNG FILE </li>
              <li onClick={this.chooseItem}> RAR FILE </li>
              <li onClick={this.chooseItem}> JPEG FILE </li>
            </ul>
          </div>)}
          
        </div>
      </div>
    )
  }
}

MilestonePostEditLinkDropDown.defaultProps = {
  titleExtraStyle: '',
  value: '',
  onChange: () => {},
  title: '',
  theme: ''
}

MilestonePostEditLinkDropDown.propTypes = {
  isCompleted: PT.bool,
  inProgress: PT.bool,
  titleExtraStyle: PT.string,
  value: PT.string,
  onChange: PT.func,
  title: PT.string,
  theme: PT.string
}

export default MilestonePostEditLinkDropDown
