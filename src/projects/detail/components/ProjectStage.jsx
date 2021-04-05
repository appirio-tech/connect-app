/**
 * Project stage
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import uncontrollable from 'uncontrollable'
import { withRouter } from 'react-router-dom'

import { formatNumberWithCommas } from '../../../helpers/format'
import { getPhaseActualData } from '../../../helpers/projectHelper'
import {
  PROJECT_ATTACHMENTS_FOLDER,
  PHASE_PRODUCT_TEMPLATE_ID,
} from '../../../config/constants'
import { filterNotificationsByPosts, filterReadNotifications, filterNotificationsByCriteria } from '../../../routes/notifications/helpers/notifications'
import { buildPhaseTimelineNotificationsCriteria, buildPhaseSpecifiationNotificationsCriteria } from '../../../routes/notifications/constants/notifications'

import PhaseCard from './PhaseCard'
import ProjectStageTabs from './ProjectStageTabs'
import EditProjectForm from './EditProjectForm'
import ProductTimelineContainer from '../containers/ProductTimelineContainer'
import PostsContainer from '../../../components/Posts'
import NotificationsReader from '../../../components/NotificationsReader'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import { hasPermission } from '../../../helpers/permissions'
import { PERMISSIONS } from '../../../config/permissions'

const enhance = spinnerWhileLoading(props => !props.processing)
const EnhancedEditProjectForm = enhance(EditProjectForm)

/**
 * Format PhaseCard attr property
 *
 * @param {Object} phase            phase
 * @param {Array}  productTemplates product templates
 * @param {Object} feed             phase feed object
 *
 * @returns {Object} PhaseCard attr property
 */
function formatPhaseCardAttr(phase, phaseIndex, productTemplates, feed, timeline) {
  // NOTE so far one phase always has 1 product
  // but as in the future this may be changed, we work with products as an array
  const product = _.get(phase, 'products[0]')
  const { status } = phase
  const productTemplate = _.find(productTemplates, { id: product.templateId })
  const budget = phase.budget || 0
  const price = `$${formatNumberWithCommas(budget)}`
  const icon = _.get(productTemplate, 'icon')
  const title = phase.name

  const {
    startDate,
    endDate,
    duration: plannedDuration,
    progress: progressInPercent,
  } = getPhaseActualData(phase, timeline)

  const duration = `${plannedDuration} day${plannedDuration !== 1 ? 's' : ''}`
  let startEndDates = startDate ? `${startDate.format('MMM D')}` : ''
  // appends end date to the start date only if end date is greater than start date
  startEndDates += startDate && endDate && endDate.diff(startDate, 'days') > 0 ? `-${endDate.format('MMM D')}` : ''
  // extracts the start date's month string plus white space
  const monthStr = startEndDates.substr(0, 4)
  // replaces the second occurrence of the month part i.e. removes the end date's month part
  startEndDates = startEndDates.lastIndexOf(monthStr) !== 0 ? startEndDates.replace(`-${monthStr}`, '-') : startEndDates

  const actualPrice = phase.spentBudget
  let paidStatus = 'Quoted'
  if (actualPrice && actualPrice === budget) {
    paidStatus = 'Paid in full'
  } else if (actualPrice && actualPrice < budget) {
    paidStatus = `$${formatNumberWithCommas(budget - actualPrice)} remaining`
  }

  const postsCount = _.get(feed, 'posts.length')
  const postsWord = postsCount === 1 ? 'post' : 'posts'
  const posts = _.isNumber(postsCount) ? `${postsCount} ${postsWord}` : null

  return {
    icon,
    title,
    duration,
    startEndDates,
    price,
    paidStatus,
    status,
    posts,
    phaseIndex,
    phase,
    progressInPercent,
    actualStartDate: startDate,
    actualEndDate: endDate,
  }
}

class ProjectStage extends React.Component{
  constructor(props) {
    super(props)

    this.removeProductAttachment = this.removeProductAttachment.bind(this)
    this.updateProductAttachment = this.updateProductAttachment.bind(this)
    this.addProductAttachment = this.addProductAttachment.bind(this)
    this.onTabClick = this.onTabClick.bind(this)
    this.state = {
      isExpanded: false
    }
  }

  removeProductAttachment(attachmentId) {
    const { project, phase, removeProductAttachment } = this.props
    const product = _.get(phase, 'products[0]')

    removeProductAttachment(project.id, phase.id, product.id, attachmentId)
  }

  updateProductAttachment(attachmentId, updatedAttachment) {
    const { project, phase, updateProductAttachment } = this.props
    const product = _.get(phase, 'products[0]')

    updateProductAttachment(project.id, phase.id, product.id, attachmentId, updatedAttachment)
  }

  addProductAttachment(attachment) {
    const { project, phase, addProductAttachment } = this.props
    const product = _.get(phase, 'products[0]')

    addProductAttachment(project.id, phase.id, product.id, attachment)
  }

  onTabClick(tab) {
    const { expandProjectPhase, phase } = this.props

    expandProjectPhase(phase.id, tab)
  }

  componentDidMount() {
    !_.isEmpty(this.props.location.hash) && this.handleUrlHash(this.props)
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props
    if (!_.isEmpty(location.hash) && location.hash !== prevProps.location.hash) {
      this.handleUrlHash(this.props)
    }
  }

  // expand a phase if necessary depending on the url hash
  handleUrlHash(props) {
    const { expandProjectPhase, phase, location } = props

    const hashParts = _.split(location.hash.substring(1), '-')
    const phaseId = hashParts[0] === 'phase' ? parseInt(hashParts[1], 10) : null

    if (phaseId && phase.id === phaseId) {
      const tab = hashParts[2]
      expandProjectPhase(phaseId, tab)
    }
  }

  render() {
    const {
      phase,
      phaseNonDirty,
      phaseIndex,
      project,
      productTemplates,
      productCategories,
      isProcessing,
      updateProduct,
      fireProductDirty,
      fireProductDirtyUndo,
      deleteProjectPhase,
      phaseState,
      collapseProjectPhase,
      expandProjectPhase,
      productsTimelines,
      phasesTopics,
      notifications,
    } = this.props

    // NOTE even though in store we keep products as an array,
    // so far we always have only one product per phase, so will display only one
    const productTemplate = _.find(productTemplates, { id: _.get(phase, 'products[0].templateId') })
    const product = _.get(phase, 'products[0]')
    const productNonDirty = _.get(phaseNonDirty, 'products[0]')
    const template = productTemplate.template
    const projectPhaseAnchor = `phase-${phase.id}-posts`

    const attachmentsStorePath = `${PROJECT_ATTACHMENTS_FOLDER}/${project.id}/phases/${phase.id}/products/${product.id}`

    const timeline = _.get(productsTimelines[product.id], 'timeline')
    const hasTimeline = !!timeline
    const defaultActiveTab = hasTimeline ? 'timeline' : 'posts'
    const currentActiveTab = _.get(phaseState, 'tab', defaultActiveTab)
    const unreadNotification = filterReadNotifications(notifications)
    const tag = `phase#${phase.id}`
    const posts = _.get(phasesTopics[tag], 'topic.posts', [])
    const unreadPostNotifications = filterNotificationsByPosts(unreadNotification, posts)
    const unreadTimelineNotifications = timeline ? filterNotificationsByCriteria(unreadNotification, buildPhaseTimelineNotificationsCriteria(timeline)) : []
    const unreadSpecificationNotifications = filterNotificationsByCriteria(unreadNotification, buildPhaseSpecifiationNotificationsCriteria(phase))

    const hasNotifications = {
      timeline: unreadTimelineNotifications.length > 0,
      posts: unreadPostNotifications.length > 0,
      specification: unreadSpecificationNotifications.length > 0,
    }

    const hasAnyNotifications = _.some(_.values(hasNotifications), _.identity)
    // we don't want to show Specification tab anymore
    // we still show it for old phases created with various Product Templates
    // but all new phases created with one new Generic Product Template we don't show it anymore
    const isGenericPhase = product.templateId === PHASE_PRODUCT_TEMPLATE_ID

    return (
      <PhaseCard
        attr={formatPhaseCardAttr(phase, phaseIndex, productTemplates, _.get(phasesTopics[tag], 'topic', {}), timeline)}
        projectStatus={project.status}
        deleteProjectPhase={() => deleteProjectPhase(project.id, phase.id)}
        timeline={timeline}
        hasUnseen={hasAnyNotifications}
        phaseId={phase.id}
        isExpanded={_.get(phaseState, 'isExpanded')}
        collapseProjectPhase={collapseProjectPhase}
        expandProjectPhase={expandProjectPhase}
        project={project}
      >
        { project.version === 'v3' &&
          <div id={projectPhaseAnchor}>
            <ProjectStageTabs
              activeTab={currentActiveTab}
              onTabClick={this.onTabClick}
              hasTimeline={hasTimeline}
              hasNotifications={hasNotifications}
              hideSpecTab={!hasPermission(PERMISSIONS.MANAGE_PROJECT_PLAN) || isGenericPhase}
            />

            {currentActiveTab === 'timeline' &&
              <ProductTimelineContainer product={product} project={project} />
            }

            {currentActiveTab === 'posts' && (
              <PostsContainer tag={tag} postUrlTemplate={`phase-${phase.id}-posts-{{postId}}`} />
            )}

            {currentActiveTab === 'specification' &&
              <div className="two-col-content content">
                <NotificationsReader
                  id={`phase-${phase.id}-specification`}
                  criteria={buildPhaseSpecifiationNotificationsCriteria(phase)}
                />
                <EnhancedEditProjectForm
                  project={product}
                  projectNonDirty={productNonDirty}
                  template={template}
                  productTemplates={productTemplates}
                  productCategories={productCategories}
                  isEdittable={hasPermission(PERMISSIONS.MANAGE_PROJECT_PLAN)}
                  submitHandler={(model) => updateProduct(project.id, phase.id, product.id, model)}
                  saving={isProcessing}
                  fireProjectDirty={(values) => fireProductDirty(phase.id, product.id, values)}
                  fireProjectDirtyUndo= {fireProductDirtyUndo}
                  addAttachment={this.addProductAttachment}
                  updateAttachment={this.updateProductAttachment}
                  removeAttachment={this.removeProductAttachment}
                  attachmentsStorePath={attachmentsStorePath}
                  canManageAttachments={hasPermission(PERMISSIONS.EDIT_PROJECT_SPECIFICATION)}
                  disableAutoScrolling
                />
              </div>
            }
          </div>
        }
      </PhaseCard>
    )
  }
}

ProjectStage.defaultProps = {
  activeTab: '',
}

ProjectStage.propTypes = {
  activeTab: PT.string,
  onTabClick: PT.func.isRequired,
  project: PT.object.isRequired,
  productTemplates: PT.array.isRequired,
  productCategories: PT.array.isRequired,
  productsTimelines: PT.object,
  phasesTopics: PT.object,
  isProcessing: PT.bool.isRequired,
  updateProduct: PT.func.isRequired,
  fireProductDirty: PT.func.isRequired,
  fireProductDirtyUndo: PT.func.isRequired,
  addProductAttachment: PT.func.isRequired,
  updateProductAttachment: PT.func.isRequired,
  removeProductAttachment: PT.func.isRequired,
  deleteProjectPhase: PT.func.isRequired,
}

export default uncontrollable(withRouter(ProjectStage), {
  activeTab: 'onTabClick',
})
