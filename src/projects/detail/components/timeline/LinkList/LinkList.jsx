import React from 'react'
import PT from 'prop-types'

import ActionsRow from '../ActionsRow'
import LinkItemForm from '../LinkItemForm'
import LinkRow from '../LinkRow'

import './LinkList.scss'

class LinkList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isAddingLink: false,
    }

    this.openAddForm = this.openAddForm.bind(this)
    this.closeAddForm = this.closeAddForm.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { isUpdating } = this.props
    const { isAddingLink } = this.state

    if (isAddingLink && isUpdating && !nextProps.isUpdating) {
      this.closeEditForm()
    }
  }

  openAddForm() {
    this.setState({isAddingLink: true})
  }

  closeAddForm() {
    this.setState({ isAddingLink: false })
  }

  render() {
    const {
      addButtonTitle,
      canAddLink,
      fakeName,
      fields,
      formAddButtonTitle,
      formAddTitle,
      formUpdateButtonTitle,
      formUpdateTitle,
      isUpdating,
      links,
      onAddLink,
      onRemoveLink,
      onSelectChange,
      onUpdateLink,
    } = this.props
    const { isAddingLink } = this.state

    return (
      <div>
        {links.map((link, index) => (
          <div styleName="top-space" key={index}>
            <LinkRow
              fields={fields}
              link={link}
              itemId={index}
              formUpdateTitle={formUpdateTitle}
              formUpdateButtonTitle={formUpdateButtonTitle}
              milestonePostLink={link.url}
              milestoneType={'only-text'}
              deleteLink={onRemoveLink}
              updateLink={onUpdateLink}
              isUpdating={isUpdating}
              onSelectChange={onSelectChange}
            />
          </div>
        ))}
        {isAddingLink && (
          <div styleName="top-space">
            <LinkItemForm
              fields={fields}
              onCancelClick={this.closeAddForm}
              onSubmit={onAddLink}
              submitButtonTitle={formAddButtonTitle}
              title={formAddTitle}
            />
          </div>
        )}
        {!isAddingLink && canAddLink && (
          <div styleName="top-space">
            <ActionsRow
              type="secondary"
              fakeName={fakeName}
              buttons={[{
                title: addButtonTitle,
                onClick: this.openAddForm,
              }]}
            />
          </div>
        )}
      </div>
    )
  }
}

LinkList.defaultProps = {
}

LinkList.propTypes = {
}

export default LinkList
