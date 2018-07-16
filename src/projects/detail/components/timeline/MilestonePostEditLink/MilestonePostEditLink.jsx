import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import './MilestonePostEditLink.scss'

class MilestonePostEditLink extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      value: props.valueDefault,
    }

    this.onValueChange = this.onValueChange.bind(this)
  }

  onValueChange(event) {
    const { onChange } = this.props
    const value = event.target.value

    this.setState({ value })
    onChange(value)
  }

  render() {
    const { theme, title, maxTitle } = this.props
    const { value } = this.state

    const maxLength = maxTitle ? maxTitle : -1

    return (
      <div styleName={cn('milestone-post', theme)}>
        <div styleName="col-left">
          <div styleName="label-title">{title}</div>
        </div>
        <div styleName="col-right">
          <div styleName="label-layer">
            {!!maxTitle && (
              <div styleName="label-counter">{`${value.length}/${maxTitle}`}</div>
            )}
            <input
              type="url"
              onChange={this.onValueChange}
              value={value}
              placeholder={title}
              maxLength={maxLength}
            />
          </div>
        </div>
      </div>
    )
  }
}

MilestonePostEditLink.defaultProps = {
  maxTitle: 0,
  theme: '',
  valueDefault: '',
}

MilestonePostEditLink.propTypes = {
  maxTitle: PT.number,
  onChange: PT.func.isRequired,
  theme: PT.string,
  valueDefault: PT.string,
}

export default MilestonePostEditLink
