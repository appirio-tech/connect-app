/**
 * Work view section
 */
import React from 'react'
import PT from 'prop-types'
import {withRouter, Link} from 'react-router-dom'
import cn from 'classnames'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'

const Formsy = FormsyForm.Formsy

import Section from '../Section'
import WorkViewEdit from './WorkViewEdit'
import ActiveMilestoneSummary from './ActiveMilestoneSummary'
import WorkTimelineContainer from '../../containers/WorkTimelineContainer'
import CloseIcon from '../../../../assets/icons/x-mark-black.svg'
import EditIcon from '../../../../assets/icons/icon-edit-black.svg'
import SelectDropdown from '../../../../components/SelectDropdown/SelectDropdown'
import PostsContainer from '../../../../components/Posts'
import WorkViewRequirements from './WorkViewRequirements'
import {
  PHASE_STATUS,
  MILESTONE_STATUS,
  POLICIES,
} from '../../../../config/constants'
import LoadingIndicator from '../../../../components/LoadingIndicator/LoadingIndicator'
import WorkItemsContainer from '../../containers/WorkItemsContainer'

import './WorkView.scss'
import WorkAssetsContainer from '../../containers/WorkAssetsContainer'
import _ from 'lodash'
import {extractAttachmentLinksFromPosts, extractLinksFromPosts} from '../../../../helpers/posts'

const phaseStatuses = PHASE_STATUS.map(ps => ({
  title: ps.name,
  value: ps.value,
}))

class WorkView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isEditing: false,
      selectedNav: 0,
      navs: [
        {title: 'Details'},
        {title: 'Requirements'},
        {title: 'Delivery Management'},
        {title: 'Assets'}
      ]
    }

    this.handleChange = this.handleChange.bind(this)
    this.submitEditForm = this.submitEditForm.bind(this)
    this.getTabContent = this.getTabContent.bind(this)
  }

  componentWillMount() {
    const {work} = this.props
    // re-update selected nav  when reshow component
    if (work && work.selectedNav) {
      this.setState({selectedNav: work.selectedNav})
    }
  }

  /**
   * Handles the change event of the form.
   *
   * @param change changed form model in flattened form
   * @param isChanged flag that indicates if form actually changed from initial model values
   */
  handleChange(change, isChanged) {
    const { work } = this.props
    if (isChanged || (work.status !== change.status)) {
      const {match: {params: {projectId, workstreamId, workId}}, updateWork} = this.props
      updateWork(projectId, workstreamId, workId, change)
    }
  }

  /**
   * Call request to submit edit form
   * @param {Object} model form value
   */
  submitEditForm(model) {
    const {match: {params: {projectId, workstreamId, workId}}, updateWork} = this.props
    updateWork(projectId, workstreamId, workId, model)
  }

  /**
   * Get topics which belong to the work
   *
   * @returns {Array} work topics
   */
  getWorkTopics() {
    const { topics, work } = this.props
    const tags = [`work#${work.id}-details`, `work#${work.id}-requirements`]

    return _.values(
      _.pick(topics, tags)
    ).filter(t => t.topic).map(t => t.topic)
  }

  /**
   * Get number of assets
   *
   * @returns {Number} number of assets
   */
  getAssetsCount() {
    const workTopics = this.getWorkTopics()

    if (workTopics) {
      const links = extractLinksFromPosts(workTopics)
      const attachments = extractAttachmentLinksFromPosts(workTopics)
      return attachments.length + links.length
    }
  }

  /**
   * Get selected tab content
   */
  getTabContent() {
    const {navs, selectedNav} = this.state
    const {
      work,
      addNewMilestone,
      editMilestone,
      timelines,
      showAddChallengeTask,
      markMilestoneAsCompleted,
      match,
      updateWork,
      isUpdatingWorkInfoWithProgressId,
      permissions
    } = this.props
    const timeline = _.get(timelines[work.id], 'timeline')
    const activeMilestone = timeline && _.find(timeline.milestones, {
      status: MILESTONE_STATUS.ACTIVE,
    })
    const workTopics = this.getWorkTopics()

    if (navs[selectedNav].title === 'Details') {
      return (
        <div styleName="content">
          <WorkTimelineContainer workId={work.id} editMode={false}/>
          {!!activeMilestone && (
            <ActiveMilestoneSummary
              work={work}
              timeline={timeline}
              milestone={activeMilestone}
              markMilestoneAsCompleted={markMilestoneAsCompleted}
              match={match}
            />
          )}
          <div styleName="comments">
            <div styleName="comments-title">Comments</div>
            <PostsContainer
              tag={`work#${work.id}-details`}
              postUrlTemplate={'details-comment-{{postId}}'}
            />
          </div>
        </div>
      )
    }
    if (navs[selectedNav].title === 'Requirements') {
      return (
        <div styleName="content">
          <WorkViewRequirements
            progressId={1}
            work={work}
            updateWork={updateWork}
            isUpdatingWorkInfoWithProgressId={isUpdatingWorkInfoWithProgressId}
            match={match}
            permissions={permissions}
          />
          <div styleName="comments">
            <div styleName="comments-title">Comments</div>
            <PostsContainer
              tag={`work#${work.id}-requirements`}
              postUrlTemplate={'requirements-comment-{{postId}}'}
            />
          </div>
        </div>
      )
    }
    if (navs[selectedNav].title === 'Delivery Management') {
      return (
        <div styleName="content">
          <WorkTimelineContainer
            workId={work.id}
            editMode
            addNewMilestone={addNewMilestone}
            editMilestone={editMilestone}
          />
          <WorkItemsContainer showAddChallengeTask={showAddChallengeTask}/>
        </div>
      )
    }
    if (navs[selectedNav].title === 'Assets') {
      return (
        <div styleName="assets-content">
          <WorkAssetsContainer
            workTopics={workTopics}
          />
        </div>
      )
    }
    return (
      <div styleName="content">
        {navs[selectedNav].title + ' tab'}
      </div>
    )
  }

  render() {
    const {
      work,
      match,
      isUpdatingWorkInfo,
      isDeletingWorkInfo,
      permissions,
    } = this.props
    const assetsCount = this.getAssetsCount()

    return (
      <Section>
        <div styleName="container">
          {this.state.isEditing ? (
            <WorkViewEdit
              {...this.props}
              onBack={() => {
                this.setState({isEditing: false})
              }}
              submitForm={this.submitEditForm}
              permissions={permissions}
            />
          ) : (
            <div styleName={cn('wrapper-content', {'is-updating': isUpdatingWorkInfo})}>
              <div styleName="header">
                <span styleName="work-name">{work.name}</span>
                <div styleName="right-control">
                  {permissions[POLICIES.WORKITEM_EDIT] && (
                    <i styleName="icon-edit" onClick={() => {
                      this.setState({isEditing: true})
                    }} title="edit"
                    >
                      <EditIcon/>
                    </i>
                  )}
                  <Link
                    onClick={() => {
                      work.selectedNav = 0
                    }}
                    to={`/projects/${match.params.projectId}`}
                    styleName="icon-close"
                  >
                    <CloseIcon/>
                  </Link>
                </div>
              </div>
              {!_.isNil(work) && (
                <Formsy.Form
                  onChange={this.handleChange}
                  ref="form"
                >
                  <div styleName="status-dropdown">
                    <SelectDropdown
                      name="status"
                      value={work.status}
                      theme="default"
                      options={phaseStatuses}
                      disabled={!permissions[POLICIES.WORKITEM_EDIT]}
                    />
                  </div>
                </Formsy.Form>
              )}
              <div styleName="nav">
                {this.state.navs.map((nav, index) => (
                  <div
                    key={nav.title}
                    styleName={cn('nav-item', {'is-selected': index === this.state.selectedNav})}
                    onClick={() => {
                      work.selectedNav = index
                      this.setState({selectedNav: index})
                    }}
                  >
                    <span styleName="nav-name">{nav.title}</span>
                    {nav.title === 'Assets' && (<span styleName="nav-count">{assetsCount}</span>)}
                  </div>
                ))}
              </div>
              {this.getTabContent()}
            </div>
          )}
          {(isUpdatingWorkInfo || isDeletingWorkInfo) && (<div styleName="loading-wrapper">
            <LoadingIndicator/>
          </div>)}
        </div>
      </Section>
    )
  }
}

WorkView.defaultProps = {
  showAddChallengeTask: () => {
  },
}

WorkView.propTypes = {
  work: PT.shape({
    id: PT.number,
    name: PT.string,
    status: PT.string,
    description: PT.string,
  }).isRequired,
  showAddChallengeTask: PT.func,
  updateWork: PT.func.isRequired,
  isUpdatingWorkInfo: PT.bool.isRequired,
  isUpdatingWorkInfoWithProgressId: PT.object.isRequired,
  isDeletingWorkInfo: PT.bool.isRequired,
  timelines: PT.object.isRequired,
  markMilestoneAsCompleted: PT.func,
  topics: PT.object,
  permissions: PT.object.isRequired,
}

export default withRouter(WorkView)
