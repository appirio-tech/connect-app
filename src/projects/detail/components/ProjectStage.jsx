/**
 * Project stage
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'
import uncontrollable from 'uncontrollable'

import { formatNumberWithCommas } from '../../../helpers/format'

import PhaseCard from './PhaseCard'
import GenericMenu from '../../../components/GenericMenu'
import EditProjectForm from './EditProjectForm'
import spinnerWhileLoading from '../../../components/LoadingSpinner'

const enhance = spinnerWhileLoading(props => !props.processing)
const EnhancedEditProjectForm = enhance(EditProjectForm)

/**
 * Format PhaseCard attr property
 *
 * @param {Object} phase phase
 *
 * @returns {Object} PhaseCard attr property
 */
function formatPhaseCardAttr(phase) {
  const { status } = phase
  // NOTE so far one phase always has 1 product
  // but as in the future this may be changed, we work with products as an array
  const budget = _.get(phase, 'products[0].budget', 0)
  const price = `$${formatNumberWithCommas(budget)}`
  const icon = _.get(phase, 'products[0].template.icon')
  const title = _.get(phase, 'products[0].template.name')
  const startDate = phase.startDate && moment(phase.startDate)
  const endDate = phase.endDate && moment(phase.endDate)
  const duration = phase.startDate && phase.endDate
    ? endDate.subtract(startDate).duration().days() + ' days'
    : '0 days'
  let startEndDates = startDate ? `${startDate.format('MMM D')}` : ''
  startEndDates += startDate && endDate ? `–${endDate.format('MMM D')}` : ''

  const actualPrice = _.get(phase, 'products[0].actualPrice')
  let paidStatus = 'Quoted'
  if (actualPrice && actualPrice === budget) {
    paidStatus = 'Paid in full'
  } else if (actualPrice && actualPrice < budget) {
    paidStatus = `$${formatNumberWithCommas(budget - actualPrice)} remaining`
  }

  return {
    icon,
    title,
    duration,
    startEndDates,
    price,
    paidStatus,
    status,
  }
}

const ProjectStage = ({
  activeTab,
  phase,
  project,
  currentMemberRole,
  isProcessing,
  isSuperUser,
  updateProject,
  fireProjectDirty,
  fireProjectDirtyUndo,
  onTabClick,
}) => {
  const tabs = [
    {
      onClick: () => onTabClick('timeline'),
      label: 'Timeline',
      isActive: activeTab === 'timeline'
    }, {
      onClick: () => onTabClick('posts'),
      label: 'Posts',
      isActive: activeTab === 'posts'
    }, {
      onClick: () => onTabClick('specification'),
      label: 'Specification',
      isActive: activeTab === 'specification'
    }
  ]

  return (
    <PhaseCard attr={formatPhaseCardAttr(phase)}>
      <div>
        <GenericMenu navLinks={tabs} />

        {activeTab === 'timeline' &&
          <div>Timeline</div>
        }

        {activeTab === 'posts' &&
          <div>Posts</div>
        }

        {activeTab === 'specification' &&
          <div className="two-col-content content">
            <EnhancedEditProjectForm
              project={project}
              sections={_.get(phase, 'products[0].template.template')}
              isEdittable={isSuperUser || !!currentMemberRole}
              submitHandler={(model) => updateProject(project.id, model)}
              saving={isProcessing}
              fireProjectDirty={fireProjectDirty}
              fireProjectDirtyUndo= {fireProjectDirtyUndo}
            />
          </div>
        }
      </div>
    </PhaseCard>
  )
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
  updateProject: PT.func.isRequired,
  fireProjectDirty: PT.func.isRequired,
  fireProjectDirtyUndo: PT.func.isRequired,
}

export default uncontrollable(ProjectStage, {
  activeTab: 'onTabClick',
})
