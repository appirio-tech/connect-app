/**
 * MilestonePostEditText component
 *
 * It's controllable component and it requires to have onChange and value properties
 */
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import './MilestonePostEditText.scss'
import BoldAdd from '../../../../../assets/icons/ui-16px-1_bold-add.svg'
import BoldRemove from '../../../../../assets/icons/ui-16px-1_bold-delete.svg'

class   MilestonePostEditText extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      autoHeight: props.autoHeight
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.onAdd = this.onAdd.bind(this)
    this.onRemove = this.onRemove.bind(this)
  }

  /**get update value from input text */
  onValueChange (event) {
    const { index, onChange } = this.props

    event.stopPropagation()
    const value = event.target.value

    this.setState({autoHeight: event.target.scrollHeight})

    onChange(index, value)
  }

  onAdd() {
    const { onAdd } = this.props

    onAdd()
  }

  onRemove() {
    const { index, onRemove } = this.props

    onRemove(index)
  }

  render() {
    const { onAdd, onRemove, theme, value } = this.props
    const props = this.props
    const autoHeightTextAreaStyle = {}
    if (this.state.autoHeight > 0 && props.isAutoExpand) {
      autoHeightTextAreaStyle['height'] = this.state.autoHeight
    }
    return (
      <div styleName={cn('milestone-post', theme)}>
        <div styleName="label-layer">
          {(!!onRemove || !!onAdd) && !props.isAutoExpand && (
            <input styleName="input-text" type="text" onChange={this.onValueChange} value={value}  placeholder={'Type your request...'} />
          )}
          {(!!onRemove || !!onAdd) && props.isAutoExpand && (
            <textarea rows="1" styleName="input-text" type="text" onChange={this.onValueChange} value={value}  placeholder={'Type your request...'} style={autoHeightTextAreaStyle}/>
          )}

          {!!onAdd && (
            <button onClick={this.onAdd} disabled={value.trim().length < 1} styleName="button-add"><BoldAdd /></button>
          )}
          {!!onRemove && (
            <button onClick={this.onRemove} styleName="button-remove"><BoldRemove /></button>
          )}
          {!onAdd && !onRemove && (
            <div styleName="content">{value}</div>
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
