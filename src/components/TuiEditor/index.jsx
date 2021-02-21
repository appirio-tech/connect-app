/*
 *  TuiEditor 
 *  wrap toast-ui editor with react and support react 15
 */

import React from 'react'
import PropTypes from 'prop-types'
import Editor from '@toast-ui/editor'
import styles from './TuiEditor.scss'
import cn from 'classnames'
import 'codemirror/lib/codemirror.css'
import '@toast-ui/editor/dist/toastui-editor.css'

class TuiEditor extends React.Component {
  constructor(props) {
    super(props)
    this.handleValueChange = this.handleValueChange.bind(this)
  }

  getRootElement() {
    return this.refs.rootEl
  }

  getInstance() {
    return this.editorInst
  }

  bindEventHandlers(props) {
    Object.keys(props)
      .filter(key => /^on[A-Z][a-zA-Z]+/.test(key))
      .forEach(key => {
        const eventName = key[2].toLowerCase() + key.slice(3)
        this.editorInst.off(eventName)
        this.editorInst.on(eventName, props[key])
      })
  }

  componentDidMount() {
    const props = {
      ...this.props,
      onChange: this.handleValueChange
    }
    this.editorInst = new Editor({
      el: this.refs.rootEl,
      ...props
    })
    this.bindEventHandlers(props)
  }

  handleValueChange(){
    if (this.props.onChange) {
      this.props.onChange(this.getInstance().getMarkdown())
    }
  }

  shouldComponentUpdate(nextProps) {
    const instance = this.getInstance()
    const { height, previewStyle, className } = nextProps

    if (this.props.height !== height) {
      instance.height(height)
    }

    if (this.props.previewStyle !== previewStyle) {
      instance.changePreviewStyle(previewStyle)
    }

    if (this.props.className !== className) {
      return true
    }
    // this.bindEventHandlers(nextProps, this.props)

    return false
  }

  render() {
    return <div ref="rootEl" className={cn(styles.editor, this.props.className)} />
  }
}


TuiEditor.propTypes = {
  onChange: PropTypes.func.isRequired,
  previewStyle: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  initialEditType: PropTypes.string.isRequired,
  initialValue: PropTypes.string,
}

export default TuiEditor
