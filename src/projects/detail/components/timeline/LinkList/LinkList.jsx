import React from 'react'
import PT from 'prop-types'

import ActionsRow from '../ActionsRow'
import LinkItemForm from '../LinkItemForm'
import LinkItem from '../LinkItem'

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
    const { isAddingLink } = this.state
    if (isAddingLink && !nextProps.isUpdating) {
      this.closeAddForm()
    }
  }

  openAddForm() {
    this.setState({ isAddingLink: true })
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
            <LinkItem
              fields={fields}
              link={link}
              itemId={index}
              formUpdateTitle={formUpdateTitle}
              formUpdateButtonTitle={formUpdateButtonTitle}
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

LinkList.propTypes = {
  /** title of the button to open add form */
  addButtonTitle: PT.string,

  /** if true then button to add link is shown */
  canAddLink: PT.bool,

  /** special case, if defined, it's shown next to add link button */
  fakeName: PT.string,

  /** fields which will be rendered by LinkItemForm, see POSSIBLE_FIELDS for all possibilities */
  fields: PT.arrayOf(PT.shape({
    name: PT.string.isRequired,
    value: PT.string,
  })),

  /** links which are already on the list */
  links: PT.array,

  /** title of add link form */
  formAddTitle: PT.string,

  /** main button text of the add link form */
  formAddButtonTitle: PT.string,

  /** title of edit link form */
  formUpdateTitle: PT.string,

  /** main button text of the edit link form */
  formUpdateButtonTitle: PT.string,

  /** add link handler */
  onAddLink: PT.func,

  /** delete link handler */
  onRemoveLink: PT.func,

  /** update link handler */
  onUpdateLink: PT.func,

  /** indicates if link is updating by one of the handlers */
  isUpdating: PT.bool,

  /** select/deselect link callback */
  onSelectChange: PT.func,
}

export default LinkList
