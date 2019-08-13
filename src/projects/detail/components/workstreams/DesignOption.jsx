/**
 * DesignOption section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
const TCFormFields = FormsyForm.Fields
import TextInputWithCounter from '../../../../components/TextInputWithCounter/TextInputWithCounter'
import LinkList from '../timeline/LinkList'
import styles from './DesignOption.scss'

class DesignOption extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      submissionId: '',
      previewUrl: '',
      presentLinks: []
    }

    this.updatedUrl = this.updatedUrl.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
  }

  updateTitleInput(title) {
    this.setState({ title })
  }

  updateSubmissionId(submissionId) {
    this.setState({ submissionId })
  }

  updatePreviewUrl(previewUrl) {
    this.setState({ previewUrl })
  }

  updatedUrl(values, linkIndex) {
    const { presentLinks } = this.state

    if (typeof linkIndex === 'number') {
      presentLinks.splice(linkIndex, 1, values)
    } else {
      presentLinks.push(values)
    }
    this.setState({ presentLinks })
  }

  removeUrl(linkIndex) {
    if (!window.confirm('Are you sure you want to remove this link?')) {
      return
    }

    const { presentLinks } = this.state
    presentLinks.splice(linkIndex, 1)
    this.setState({ presentLinks })
  }

  render() {
    const { title, submissionId, previewUrl, presentLinks } = this.state
    const {  } = this.props
    return (
      <div className={`${styles['container']}`}>
        <div className={`${styles['left-column']}`}>

        </div>
        <div className={`${styles['right-column']}`}>
          <Formsy.Form
            ref="form"
            className={`${styles['form-container']}`}
            disabled={false}
            // onInvalid={() => {}}
            // onValid={() => {}}
            // onValidSubmit={() => {}}
            // onChange={() => {}}
          >
            <TextInputWithCounter
              wrapperClass={`${styles['title-input']}`}
              label="Title"
              name="title-input"
              type="text"
              maxLength="64"
              disabled={false}
              value={title}
              onChange={(name, value) => {
                this.updateTitleInput(value)
              }}
            />
            <TCFormFields.TextInput
              wrapperClass={`${styles['submission-id-input']}`}
              label="Submission Id"
              name="submission-id-input"
              type="number"
              disabled={false}
              value={submissionId}
              onChange={(name, value) => {
                this.updateSubmissionId(value)
              }}
            />
            <TCFormFields.TextInput
              wrapperClass={`${styles['preview-link-input']}`}
              label="Preview URL"
              name="preview-link-input"
              type="text"
              disabled={false}
              value={previewUrl}
              onChange={(name, value) => {
                this.updatePreviewUrl(value)
              }}
            />
            <div className={`${styles['links-wrapper']}`}>
              <div className={`${styles['links-title']}`}>Presentation links</div>
              <LinkList
                links={presentLinks}
                onAddLink={this.updatedUrl}
                onRemoveLink={this.removeUrl}
                onUpdateLink={this.updatedUrl}
                fields={[{
                  name: 'title',
                  value: `Design ${presentLinks.length + 1}`,
                  maxLength: 64,
                }, {
                  name: 'url'
                }]}
                addButtonTitle="Add design link"
                formAddTitle="Add Design Link"
                formAddButtonTitle="Add link"
                formUpdateTitle="Editing link"
                formUpdateButtonTitle="Save changes"
                // isUpdating={milestone.isUpdating}
                // fakeName={`Design ${links.length + 1}`}
                canAddLink
              />
            </div>
          </Formsy.Form>
        </div>
      </div>
    )
  }
}

DesignOption.defaultProps = {
}

DesignOption.propTypes = {
}

export default withRouter(DesignOption)
