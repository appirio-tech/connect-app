import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import './MilestonePostEditText.scss'

class   MilestonePostEditText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.value || '',
      autoHeight: props.autoHeight
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.onRemove = this.onRemove.bind(this)
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

  onAdd() {
    const { onAdd } = this.props
    const { value } = this.state

    this.setState({ value: '' })
    onAdd(value)
  }

  onRemove() {
    const { index, onRemove } = this.props

    onRemove(index)
  }

  render() {
    const { onAdd, onRemove, theme } = this.props
    const props = this.props
    const autoHeightTextAreaStyle = {}
    if (this.state.autoHeight > 0 && props.isAutoExpand) {
      autoHeightTextAreaStyle['height'] = this.state.autoHeight
    }
    return (
      <div styleName={cn('milestone-post', theme)}>
        <div styleName="label-layer">
          {(!!onRemove || !!onAdd) && !props.isAutoExpand && (
            <input styleName="input-text" type="text" onChange={this.onValueChange} value={this.state.value}  placeholder={'Type your request...'} />
          )}
          {(!!onRemove || !!onAdd) && props.isAutoExpand && (
            <textarea rows="1" styleName="input-text" type="text" onChange={this.onValueChange} value={this.state.value}  placeholder={'Type your request...'} style={autoHeightTextAreaStyle}/>
          )}

          {!!onAdd && (
            <button onClick={this.onAdd} disabled={this.state.value.trim().length < 1} styleName="button-add">{'+'}</button>
          )}
          {!!onRemove && (
            <button onClick={this.onRemove} styleName="button-remove">{'-'}</button>
          )}
          {!onAdd && !onRemove && (
            <div styleName="content">{this.state.value}</div>
          )}
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
