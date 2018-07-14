import React from 'react'
import PT from 'prop-types'
import './MilestonePostEditText.scss'



class   MilestonePostEditText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.content,
      autoHeight: props.autoHeight
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.actionHandler = this.actionHandler.bind(this)
  }

  /**
   * This function gets triggered when click to button
   */
  actionHandler() {
    const props = this.props
    props.action(this.state.value, props.index, this.state.autoHeight)
  }
  /**get update value from input text */
  onValueChange (event) {
    event.stopPropagation()
    const value = event.target.value
    this.setState({value})
    const props = this.props
    props.update(value, props.index, event.target.scrollHeight)
    this.setState({autoHeight: event.target.scrollHeight})
  }

  render() {
    const props = this.props
    const autoHeightTextAreaStyle = {}
    if (this.state.autoHeight > 0 && props.isAutoExpand) {
      autoHeightTextAreaStyle['height'] = this.state.autoHeight
    }
    return (
      <div styleName={'milestone-post '
      + (props.theme ? props.theme : '')
      }
      >
        <div styleName="label-layer">
          {
            !props.isComplete && !props.isAutoExpand && (
              <input styleName="input-text" type="text" onChange={this.onValueChange} value={this.state.value}  placeholder={'Type your request...'} />
            )
          }
          {
            !props.isComplete && props.isAutoExpand && (
              <textarea rows="1" styleName="input-text" type="text" onChange={this.onValueChange} value={this.state.value}  placeholder={'Type your request...'} style={autoHeightTextAreaStyle}/>
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
              <div styleName="content" style={autoHeightTextAreaStyle}>{this.state.value}</div>
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
  isComplete: false,
  isAutoExpand: false,
  autoHeight: 0
}

MilestonePostEditText.propTypes = {
  action: PT.func,
  update: PT.func,
  index: PT.number,
  content: PT.string,
  isComplete: PT.bool,
  isAutoExpand: PT.bool,
  autoHeight: PT.number
}

export default MilestonePostEditText
