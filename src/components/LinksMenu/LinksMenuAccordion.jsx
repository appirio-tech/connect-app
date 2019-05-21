import React from 'react'
import PropTypes from 'prop-types'
import IconCarretDownNormal from '../../assets/icons/arrow-6px-carret-down-normal.svg'
import './LinksMenuAccordion.scss'
import BtnRemove from '../../assets/icons/ui-16px-1_trash-simple.svg'
import DeleteFileLinkModal from './DeleteFileLinkModal'


class LinksMenuAccordion extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isOpen: false,
      linkToDelete: -1
    }

    this.toggleAccordion = this.toggleAccordion.bind(this)
    this.onDeleteConfirm = this.onDeleteConfirm.bind(this)
    this.onDeleteCancel = this.onDeleteCancel.bind(this)
    this.deleteLink = this.deleteLink.bind(this)
  }

  toggleAccordion() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  onDeleteConfirm() {
    console.log('ok')
  }

  onDeleteCancel() {
    this.setState({
      linkToDelete: -1
    })
  }

  deleteLink(idx) {
    this.setState({
      linkToDelete: idx
    })
  }

  render() {
    const { link, renderLink, canEdit } = this.props
    const { isOpen, linkToDelete } = this.state
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
                if (linkToDelete === i) {
                  return (
                    <li className="delete-confirmation-modal" key={'delete-confirmation-post-attachment-' + i}>
                      <DeleteFileLinkModal
                        link={link}
                        onCancel={this.onDeleteCancel}
                        onConfirm={this.onDeleteConfirm}
                      />
                    </li>
                  )
                }
                return (<li key={`childlink-${childLink.address}-${i}`}>
                  {renderLink(childLink)}
                  <div className="button-group">
                    {canEdit && childLink.deletable && <div className="buttons link-buttons">
                      <button type="button" onClick={() => onDelete(childLink)}>
                        <BtnRemove />
                      </button>
                    </div>}
                  </div>
                </li>)
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
  renderLink: PropTypes.func.isRequired,
  canEdit: PropTypes.bool,
}

export default LinksMenuAccordion
