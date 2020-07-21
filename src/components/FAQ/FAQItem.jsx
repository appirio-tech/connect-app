import React, { Component } from 'react'
import cn from 'classnames'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import IconX from ' ../../assets/icons/ui-x-mark.svg'
import IconCarretDown from '../../assets/icons/arrow-6px-carret-down-normal.svg'
import { CONTENTFUL_NODE_TYPES } from '../../config/constants'
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
    
    const FormattedHyperLink = ({ value, url }) => <a href={url} target="_blank" className="hyperlink-style">{value}</a>
    const options = {
      renderNode: {/* eslint-disable no-unused-vars*/
        [CONTENTFUL_NODE_TYPES.HYPERLINK]: (node, children) => <FormattedHyperLink value={node.content[0].value} url={node.data.uri}/>
      }
    }
    return (
      <div styleName={cn('accordion', { 'is-open': isOpen })}>
        <div styleName="header" onClick={this.toggle}>
          <div styleName="title">{item.fields.question}</div>
          <div styleName="toggle">
            {isOpen ? <IconX styleName="toggle-icon" /> : <IconCarretDown styleName="toggle-icon" />}
          </div>
        </div>
        <div styleName="content">{documentToReactComponents(item.fields.answer, options)}</div>
      </div>
    )
  }
}

export default FAQItem