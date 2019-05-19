import React from 'react'
import PropTypes from 'prop-types'
import IconCarretDownNormal from '../../assets/icons/arrow-6px-carret-down-normal.svg'
import './LinksMenuAccordion.scss'


class LinksMenuAccordion extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false,
    }

    this.toggleAccordion = this.toggleAccordion.bind(this)
  }

  toggleAccordion() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    const { link, renderLink } = this.props
    const { isOpen } = this.state
    const iconClasses = `icon ${isOpen ? 'active' : ''}`
    return (
      <div styleName="link-accordion">
        <div styleName="link-accordion-head" onClick={this.toggleAccordion}>
          <span><IconCarretDownNormal styleName={iconClasses}/></span>
          <span styleName="link-accordion-title">{link.title}</span>
        </div>
        {isOpen && <div styleName="link-accordion-content">
          <ul>
            {
              link.children.map((childLink, i) => {
                return <li key={`childlink-${childLink.address}-${i}`}>{renderLink(childLink)}</li>
              })
            }
          </ul>
        </div>}
      </div>
    )
  }
}

LinksMenuAccordion.propTypes = {
  link: PropTypes.object.isRequired,
  renderLink: PropTypes.func.isRequired
}

export default LinksMenuAccordion
