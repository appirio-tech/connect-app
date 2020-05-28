import React, { Component } from 'react'
import cn from 'classnames'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import IconX from ' ../../assets/icons/ui-x-mark.svg'
import IconCarretDown from '../../assets/icons/arrow-6px-carret-down-normal.svg'
import './FAQItem.scss'


class FAQItem extends Component  {
  constructor(props) {
    super(props)
    this.state = { isOpen : false }
    
    this.toggle = this.toggle.bind(this)
  }

  toggle(evt) {
    evt.preventDefault()

    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    const {item} = this.props
    const {isOpen} = this.state
    return (
      <div styleName={cn('accordion', { 'is-open': isOpen })}>
        <div styleName="header" onClick={this.toggle}>
          <div styleName="title">{item.fields.question}</div>
          <div styleName="toggle">
            {isOpen ? <IconX styleName="toggle-icon" /> : <IconCarretDown styleName="toggle-icon" />}
          </div>
        </div>
        <div styleName="content">{documentToReactComponents(item.fields.answer)}</div>
      </div>
    )
  }
}

export default FAQItem