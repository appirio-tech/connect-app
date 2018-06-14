/**
 * Project stage
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import uncontrollable from 'uncontrollable'

import { formatNumberWithCommas } from '../../../helpers/format'
import { PROJECT_ATTACHMENTS_FOLDER } from '../../../config/constants'

import PhaseCard from './PhaseCard'
import GenericMenu from '../../../components/GenericMenu'
import EditProjectForm from './EditProjectForm'
import PhaseFeed from './PhaseFeed'
import { phaseFeedHOC } from '../containers/PhaseFeedHOC'
import spinnerWhileLoading from '../../../components/LoadingSpinner'

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
function formatPhaseCardAttr(phase, productTemplates, feed) {
  // NOTE so far one phase always has 1 product
  // but as in the future this may be changed, we work with products as an array
  const product = _.get(phase, 'products[0]')
  const { status } = phase
  const productTemplate = _.find(productTemplates, { id: product.templateId })
  const budget = phase.budget || 0
  const price = `$${formatNumberWithCommas(budget)}`
  const icon = _.get(productTemplate, 'icon')
  const title = _.get(productTemplate, 'name')
  const startDate = phase.startDate && moment(phase.startDate)
  const endDate = phase.endDate && moment(phase.endDate)
  const duration = startDate && endDate
    ? (endDate.diff(startDate, 'days') + 1) + ' days'
    : '0 days'
  let startEndDates = startDate ? `${startDate.format('MMM D')}` : ''
  startEndDates += startDate && endDate ? `–${endDate.format('MMM D')}` : ''

  const actualPrice = product.actualPrice
  let paidStatus = 'Quoted'
  if (actualPrice && actualPrice === budget) {
    paidStatus = 'Paid in full'
  } else if (actualPrice && actualPrice < budget) {
    paidStatus = `$${formatNumberWithCommas(budget - actualPrice)} remaining`
  }

  const postsCount = _.get(feed, 'posts.length')
  const postsWord = postsCount === 1 ? 'post' : 'posts'
  const posts = _.isNumber(postsCount) ? `${postsCount} ${postsWord}` : null
  const progressInPercent = phase.progress || 0
  return {
    icon,
    title,
    duration,
    startEndDates,
    price,
    paidStatus,
    status,
    posts,
    progressInPercent
  }
}

class ProjectStage extends React.Component{
  constructor(props) {
    super(props)

    this.removeProductAttachment = this.removeProductAttachment.bind(this)
    this.updateProductAttachment = this.updateProductAttachment.bind(this)
    this.addProductAttachment = this.addProductAttachment.bind(this)
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

  render() {
    const {
      activeTab,
      phase,
      project,
      productTemplates,
      currentMemberRole,
      isProcessing,
      isSuperUser,
      updateProduct,
      fireProductDirty,
      fireProductDirtyUndo,
      onTabClick,

      // comes from phaseFeedHOC
      currentUser,
      feed,
      onLoadMoreComments,
      onAddNewComment,
      isAddingComment,
      onDeleteMessage,
      allMembers,
      onSaveMessage,
    } = this.props

    const tabs = [
      {
        onClick: () => onTabClick('posts'),
        label: 'Posts',
        isActive: activeTab === 'posts'
      }, 
      {
        onClick: () => onTabClick('specification'),
        label: 'Specification',
        isActive: activeTab === 'specification'
      }
    ]

    // NOTE even though in store we keep products as an array,
    // so far we always have only one product per phase, so will display only one
    const productTemplate = _.find(productTemplates, { id: _.get(phase, 'products[0].templateId') })
    const product = _.get(phase, 'products[0]')
    const sections = _.get(productTemplate, 'template.questions', [])

    const attachmentsStorePath = `${PROJECT_ATTACHMENTS_FOLDER}/${project.id}/phases/${phase.id}/products/${product.id}`

    return (
      <PhaseCard attr={formatPhaseCardAttr(phase, productTemplates, feed)}>
        <div>
          <GenericMenu navLinks={tabs} />

          {activeTab === 'posts' &&
            <PhaseFeed
              user={currentUser}
              currentUser={currentUser}
              feed={feed}
              onLoadMoreComments={onLoadMoreComments}
              onAddNewComment={onAddNewComment}
              isAddingComment={isAddingComment}
              onDeleteMessage={onDeleteMessage}
              allMembers={allMembers}
              onSaveMessage={onSaveMessage}
            />
          }

          {activeTab === 'specification' &&
            <div className="two-col-content content">
              <EnhancedEditProjectForm
                project={product}
                sections={sections}
                isEdittable={isSuperUser || !!currentMemberRole}
                submitHandler={(model) => updateProduct(project.id, phase.id, product.id, model)}
                saving={isProcessing}
                fireProjectDirty={(values) => fireProductDirty(phase.id, product.id, values)}
                fireProjectDirtyUndo= {fireProductDirtyUndo}
                addAttachment={this.addProductAttachment}
                updateAttachment={this.updateProductAttachment}
                removeAttachment={this.removeProductAttachment}
                attachmentsStorePath={attachmentsStorePath}
                canManageAttachments={!!currentMemberRole}
              />
            </div>
          }
        </div>
      </PhaseCard>
    )
  }
}

ProjectStage.defaultProps = {
  activeTab: 'timeline',
  currentMemberRole: null,
}

ProjectStage.propTypes = {
  activeTab: PT.string,
  onTabClick: PT.func.isRequired,
  project: PT.object.isRequired,
  currentMemberRole: PT.string,
  isProcessing: PT.bool.isRequired,
  isSuperUser: PT.bool.isRequired,
  updateProduct: PT.func.isRequired,
  fireProductDirty: PT.func.isRequired,
  fireProductDirtyUndo: PT.func.isRequired,
  addProductAttachment: PT.func.isRequired,
  updateProductAttachment: PT.func.isRequired,
  removeProductAttachment: PT.func.isRequired,
}

const ProjectStageUncontrollable = uncontrollable(ProjectStage, {
  activeTab: 'onTabClick',
})

export default phaseFeedHOC(ProjectStageUncontrollable)
