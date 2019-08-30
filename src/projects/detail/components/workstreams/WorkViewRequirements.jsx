/**
 * WorkViewRequirements section
 */
import React from 'react'
import PT from 'prop-types'

import RichTextEditable from '../../../../components/RichTextEditable/RichTextEditable'
import LoadingIndicator from '../../../../components/LoadingIndicator/LoadingIndicator'
import EditIcon from  '../../../../assets/icons/icon-edit-black.svg'
import { markdownToHTML } from '../../../../helpers/markdownToState'
import {
  POLICIES,
} from '../../../../config/constants'


import './WorkViewRequirements.scss'


class WorkViewRequirements extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showEditForm: false,
    }

    this.updateRequirements = this.updateRequirements.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const {
      progressId,
    } = nextProps

    // close edit feedback form
    const prevIsUpdatingWorkInfoWithProgressId = _.get(this.props, `isUpdatingWorkInfoWithProgressId.${progressId}`)
    const nextIsUpdatingWorkInfoWithProgressId = _.get(nextProps, `isUpdatingWorkInfoWithProgressId.${progressId}`)
    if (
      prevIsUpdatingWorkInfoWithProgressId &&
      nextIsUpdatingWorkInfoWithProgressId &&
      prevIsUpdatingWorkInfoWithProgressId.isLoading === true &&
      nextIsUpdatingWorkInfoWithProgressId.isLoading === false &&
      !nextIsUpdatingWorkInfoWithProgressId.error) {
      this.setState({ showEditForm: false })
    }
  }

  /**
   * update general feedback
   * @param {Object} newRequirement newRequirement content
   */
  updateRequirements(newRequirement) {
    const {
      match: {params: {projectId, workstreamId, workId}},
      updateWork,
      progressId,
    } = this.props
    updateWork(projectId, workstreamId, workId, {
      requirements: newRequirement.content
    }, [progressId])
  }

  render() {
    const {
      work,
      isUpdatingWorkInfoWithProgressId,
      progressId,
      permissions
    } = this.props
    const { showEditForm } = this.state
    const { requirements } = work

    return (
      <div styleName={`container ${showEditForm ? 'is-editing' : ''}`}>
        <div styleName="header">
          <span styleName="title">Requirements</span>
          {permissions[POLICIES.WORK_EDIT] && !showEditForm && (
            <a
              href="javascript:;"
              onClick={() => { this.setState({ showEditForm: true }) }}
              type="button"
            >
              <EditIcon />
            </a>
          )}
        </div>
        {showEditForm ? (
          <RichTextEditable
            contentPlaceholder={'New requirements...'}
            content={requirements ? requirements.trim() : ''}
            cancelEdit={() => { this.setState({ showEditForm: false }) }}
            onPost={newRequirement => this.updateRequirements(newRequirement)}
            isCreating={false}
            hasPrivateSwitch={false}
            canUploadAttachment={false}
          />
        ) : (
          <div
            className="draftjs-post"
            styleName="requirements-text-container"
            dangerouslySetInnerHTML={{__html: markdownToHTML(requirements ? requirements : 'No requirements')}}
          />
        )}
        {isUpdatingWorkInfoWithProgressId[progressId] && isUpdatingWorkInfoWithProgressId[progressId].isLoading && (<div styleName="loading-container">
          <LoadingIndicator />
        </div>)}
      </div>
    )
  }
}

WorkViewRequirements.propTypes = {
  work: PT.shape({
    id: PT.number.isRequired,
    name: PT.string.isRequired,
    status: PT.string.isRequired,
    description: PT.string,
  }).isRequired,
  isUpdatingWorkInfoWithProgressId: PT.object.isRequired,
  updateWork: PT.func.isRequired,
  progressId: PT.number.isRequired,
  permissions: PT.object.isRequired,
}

export default WorkViewRequirements
