import React, { Component } from 'react'
import linkifyIt from 'linkify-it'
import tlds from 'tlds'

import styles from './Link.scss'

const linkify = linkifyIt()
linkify.tlds(tlds)

// The component we render when we encounter a hyperlink in the text
export default class Link extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editingLink: false
    }
    this.lastDecoratedText = null
  }

  componentDidMount() {
    const { contentState, entityKey, decoratedText } = this.props
    this.lastDecoratedText = decoratedText
    this.setElementGetter(contentState, entityKey)
  }

  componentWillUnmount() {
    const { contentState, entityKey } = this.props
    this.removeElementGetter(contentState, entityKey)
  }

  setElementGetter(contentState, entityKey) {
    contentState.mergeEntityData(entityKey, {
      el: () => {
        return this.element
      }
    })
  }

  removeElementGetter(contentState, entityKey) {
    contentState.mergeEntityData(entityKey, {
      el: null
    })
  }

  componentWillUpdate(newProps) {
    this.updateEntityData(newProps)
  }

  getData(contentState, entityKey) {
    const entity = contentState.getEntity(entityKey)
    const data = entity.getData()
    return data
  }

  updateEntityData(props = this.props) {
    const { contentState, decoratedText, entityKey } = props
    const data = this.getData(contentState, entityKey)

    if (
      this.lastDecoratedText !== decoratedText &&
      data.url &&
      data.url.replace(/https?:\/\//, '') !== decoratedText &&
      data.url !== decoratedText
    ) {
      this.lastDecoratedText = decoratedText
      contentState.mergeEntityData(entityKey, {
        text: decoratedText
      })
    }

    if (!data.el) {
      this.setElementGetter(contentState, entityKey)
    }
  }

  onLinkClick() {
    this.setState(({ editingLink }) =>
      !editingLink
        ? {
          editingLink: true
        }
        : {}
    )
  }

  render() {
    const {
      target = '_self',
      rel = 'noreferrer noopener',
      entityKey,
      contentState,
      children
    } = this.props

    const data = contentState.getEntity(entityKey).getData()
    const href = data.url

    const props = {
      href,
      target,
      rel,
      className: styles.link,
      children
    }

    return (
      <span
        ref={el => {
          this.element = el
        }}
      >
        <a {...props} onClick={() => this.onLinkClick()} />
      </span>
    )
  }
}
