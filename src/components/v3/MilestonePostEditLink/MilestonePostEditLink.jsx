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
          <div styleName={'label-title ' + props.titleExtraStyle}>{title}</div>
          <input type="url" onChange={this.onValueChange} value={this.state.value}  placeholder={title} maxLength={maxLength}/>
        </div>
      </div>
    )
  }
}

MilestonePostEditLink.defaultProps = {
  onChange: () => {},
  valueDefault: '',
  titleExtraStyle: '',
}

MilestonePostEditLink.propTypes = {
  onChange: PT.func,
  valueDefault: PT.string,
  titleExtraStyle: PT.string,
}

export default MilestonePostEditLink
