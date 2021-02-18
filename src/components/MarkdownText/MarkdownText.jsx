import React, { Component } from 'react'
import styles from './MarkdownText.scss'
import PropTypes from 'prop-types'
import EasyMDE from 'easymde'
import marked from 'marked'
import cn from 'classnames'
import _ from 'lodash'

class MarkdownText extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isChanged: false
    }
    this.blurTheField = this.blurTheField.bind(this)
    this.updateDescriptionThrottled = _.throttle(this.updateDescription.bind(this), 10000) // 10s
  }

  blurTheField () {
    const { onChange } = this.props
    onChange(this.easymde.value())
  }

  updateDescription () {
    const { onChange } = this.props
    onChange(this.easymde.value())
  }

  componentDidMount () {
    const { value, readOnly } = this.props
    if (!readOnly) {
      this.easymde = new EasyMDE({ element: this.refs.textarea, initialValue: value })
      this.easymde.codemirror.on('change', () => {
        this.setState({ isChanged: true })
        this.updateDescriptionThrottled(this.easymde.value())
      })
      this.easymde.codemirror.on('blur', () => {
        if (this.state.isChanged) {
          this.setState({ isChanged: false })
          this.blurTheField()
        }
      })
    } else {
      this.ref.current.innerHTML = value ? marked(value) : ''
    }
  }

  render () {
    const { isPrivate, readOnly, placeholder, className } = this.props
    return (<div className={cn(className, styles.editor, { [styles.isPrivate]: isPrivate })}>
      {readOnly ? (
        <div ref="textarea" />
      ) : (
        <textarea
          ref="textarea" 
          placeholder={placeholder}
        />
      )}
    </div>)
  }
}

MarkdownText.defaultProps = {
  isPrivate: false,
  readOnly: false
}

MarkdownText.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  isPrivate: PropTypes.bool,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool
}
export default MarkdownText
