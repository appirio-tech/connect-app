import React from 'react'
import PT from 'prop-types'
import './MilestonePostEditText.scss'



class MilestonePostEditText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.content,
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.actionHandler = this.actionHandler.bind(this)
  }

  /**
   * This function gets triggered when click to button
   */
  actionHandler() {
    const props = this.props
    props.action(this.state.value, props.index)
  }

  onValueChange (event) {
    event.stopPropagation()
    const value = event.target.value
    this.setState({value})
    const props = this.props
    props.update(value, props.index)
  }

  render() {
    const props = this.props
    return (
      <div styleName={'milestone-post ' 
      + (props.theme ? props.theme : '')
      }
      >
        <div styleName="label-layer">
          {
            !props.isComplete && (
              <input type="text" onChange={this.onValueChange} value={this.state.value}  placeholder={'Type your request...'} />
            )
          }
          {props.isAdd && !props.isComplete && (
            <button onClick={this.actionHandler} styleName="button-add">{'+'}</button>
          )}
          {!props.isAdd && !props.isComplete && (
            <button onClick={this.actionHandler} styleName="button-remove">{'-'}</button>
          )}
          {
            props.isComplete && (
              <div styleName="content">{this.state.value}</div>
            )
          }
        </div>
      </div>
    )
  }
}

MilestonePostEditText.defaultProps = {
  action: () => {},
  update: () => {},
  index: 0,
  content: '',
  isComplete: false
}

MilestonePostEditText.propTypes = {
  action: PT.func,
  update: PT.func,
  index: PT.number,
  content: PT.string,
  isComplete: PT.bool
}

export default MilestonePostEditText
