import React from 'react'
import PT from 'prop-types'
import './MilestonePostEditLink.scss'



class MilestonePostEditLink extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: props.valueDefault,
      currentCount: 0
    }
    this.onValueChange = this.onValueChange.bind(this)
  }

  onValueChange (event) {
    event.stopPropagation()
    const value = event.target.value
    this.setState({value})
    const props = this.props
    props.onChange(value)
  }

  render() {
    const props = this.props
    const title = props.title ? props.title : 'Title'
    const maxTitle = props.maxTitle ? props.maxTitle : 0
    const numberOfCharacter = this.state.value.length
    const maxLength = (maxTitle > 0) ? maxTitle : -1
    const labelStyle = {}
    if (props.titleSpace !== '') {
      labelStyle['marginRight'] = props.titleSpace
    }
    if (props.paddingLeft !== '') {
      labelStyle['paddingLeft'] = props.paddingLeft
    }
    return (
      <div styleName={'milestone-post ' 
      + (props.theme ? props.theme : '')
      }
      >
        {
          maxTitle > 0 && (
            <div styleName="label-counter">{`${numberOfCharacter}/${maxTitle}`}</div>
          )
        }
        <div styleName="label-layer">
          <div style={labelStyle} styleName="label-title">{title}</div>
          <input type="text" onChange={this.onValueChange} value={this.state.value}  placeholder={title} maxLength={maxLength}/>
        </div>
      </div>
    )
  }
}

MilestonePostEditLink.defaultProps = {
  onChange: () => {},
  valueDefault: '',
  titleSpace: '',
  paddingLeft: '',
}

MilestonePostEditLink.propTypes = {
  onChange: PT.func,
  valueDefault: PT.string,
  titleSpace: PT.string,
  paddingLeft: PT.string
}

export default MilestonePostEditLink
