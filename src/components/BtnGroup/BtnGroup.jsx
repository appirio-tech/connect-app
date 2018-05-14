/**
 * Group of buttons which works like toggle
 *
 * Only one button can be pressed/active at a time
 */
import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import './BtnGroup.scss'

class BtnGroup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.defaultValue || props.value
    }
  }

  render() {
    return (
      <div className="btn-group">
        {this.props.items.map(item => (
          <button
            key={item.value}
            className={cn('tc-btn tc-btn-sm tc-btn-default', { active: item.value === this.state.value })}
            onClick={() => {
              if (item.value !== this.state.value) {
                this.setState({ value: item.value })
                if (this.props.onChange) {
                  this.props.onChange(item.value)
                }
              }
            }}
          >
            {item.text}
          </button>
        ))}
      </div>
    )
  }
}

BtnGroup.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })).isRequired,
  onChange: PropTypes.func
}

export default BtnGroup
