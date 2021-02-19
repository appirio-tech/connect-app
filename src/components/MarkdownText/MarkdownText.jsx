import React, { Component } from 'react'
import styles from './MarkdownText.scss'
import PropTypes from 'prop-types'
import EasyMDE from 'easymde'
import { markdownToHTML } from '../../helpers/markdownToState'

class MarkdownText extends Component {
  constructor (props) {
    super(props)
    this.updateDescription = this.updateDescription.bind(this)
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
        this.updateDescription()
      })
    } else {
      this.refs.textarea.innerHTML = value ? markdownToHTML(value) : ''
    }
  }

  render () {
    const { readOnly, placeholder } = this.props
    return (<div className={styles.editor}>
      {readOnly ? (
        <div ref="textarea" className="EasyMDEContainer-readonly"/>
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
  readOnly: false
}

MarkdownText.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool
}
export default MarkdownText
