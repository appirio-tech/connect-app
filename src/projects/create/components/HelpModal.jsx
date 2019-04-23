import React, { Component } from 'react'
import Modal from 'react-modal'

import styles from './HelpModal.scss'

export default class HelpModal extends Component {
  constructor(props) {
    super(props)
    this.state = { isOpen: false }
    this.onLinkClick = this.onLinkClick.bind(this)
    this.onCloseClick = this.onCloseClick.bind(this)
  }

  onLinkClick() {
    this.setState({ isOpen: true })
  }
  onCloseClick() {
    this.setState({ isOpen: false })
  }

  render() {
    const { linkTitle, title, content } = this.props
    const { isOpen } = this.state

    return (
      <span>
        <a styleName="help-link-title" onClick={this.onLinkClick}>{linkTitle}</a>
        <Modal
          isOpen={isOpen}
          styleName="help-modal"
          overlayClassName={styles['help-overlay'] + ' management-dialog-overlay'}
          contentLabel={title}
        >
          <div styleName="help-close" onClick={this.onCloseClick} />

          <div className="modal-title">
            {title}
          </div>

          <div className="modal-body">
            <div styleName="help-body" dangerouslySetInnerHTML={{__html: content}} />
          </div>
        </Modal>
      </span>
    )
  }
}
