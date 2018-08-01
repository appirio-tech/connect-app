/**
 * Milestone type 'phase-specification`
 */
import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import DotIndicator from '../../DotIndicator'
import LinkList from '../../LinkList'

import { MILESTONE_STATUS } from '../../../../../../config/constants'

import './MilestoneTypePhaseSpecification.scss'

class MilestoneTypePhaseSpecification extends React.Component {
  constructor(props) {
    super(props)

    this.updatedUrl = this.updatedUrl.bind(this)
    this.removeUrl = this.removeUrl.bind(this)
    this.completeMilestone = this.completeMilestone.bind(this)
  }

  updatedUrl(values, linkIndex) {
    const { milestone, updateMilestoneContent } = this.props

    const links = [..._.get(milestone, 'details.content.links', [])]

    values.title = 'Specification'
    values.type = 'document'

    if (typeof linkIndex === 'number') {
      links.splice(linkIndex, 1, values)
    } else {
      links.push(values)
    }

    updateMilestoneContent({
      links
    })
  }

  removeUrl(linkIndex) {
    if (!window.confirm('Are you sure you want to remove specification link?')) {
      return
    }

    const { milestone, updateMilestoneContent } = this.props
    const links = [..._.get(milestone, 'details.content.links', [])]

    links.splice(linkIndex, 1)

    updateMilestoneContent({
      links
    })
  }

  completeMilestone() {
    const { completeMilestone } = this.props

    completeMilestone()
  }

  render() {
    const { milestone, theme, currentUser } = this.props

    const links = _.get(milestone, 'details.content.links', [])
    const isActive = milestone.status === MILESTONE_STATUS.ACTIVE
    const isCompleted = milestone.status === MILESTONE_STATUS.COMPLETED
    // can add only one specification link
    const canAddLink = links.length < 1

    return (
      <div styleName={cn('milestone-post', theme)}>
        {/*
          Active state
         */}
        {isActive && (
          <div>

            <DotIndicator isDone={links.length > 0}>
              <LinkList
                links={links}
                onAddLink={this.updatedUrl}
                onRemoveLink={this.removeUrl}
                onUpdateLink={this.updatedUrl}
                fields={[{ name: 'url' }]}
                addButtonTitle="Add specification document link"
                formAddTitle="Specification document link"
                formAddButtonTitle="Add link"
                formUpdateTitle="Editing a link"
                formUpdateButtonTitle="Save changes"
                isUpdating={milestone.isUpdating}
                canAddLink={canAddLink}
              />
            </DotIndicator>

            {!currentUser.isCustomer && links.length > 0 && (
              <div styleName="top-space">
                <DotIndicator>
                  <div styleName="button-layer">
                    <button
                      className="tc-btn tc-btn-primary tc-btn-sm action-btn"
                      onClick={this.completeMilestone}
                    >
                      Mark as completed
                    </button>
                  </div>
                </DotIndicator>
              </div>
            )}
          </div>
        )}

        {/*
          Completed state
         */}
        {isCompleted && (
          <div>
            <DotIndicator isDone>
              <LinkList links={links} />
            </DotIndicator>
          </div>
        )}
      </div>
    )
  }
}

MilestoneTypePhaseSpecification.defaultProps = {
  theme: null,
}

MilestoneTypePhaseSpecification.propTypes = {
  completeMilestone: PT.func.isRequired,
  currentUser: PT.object.isRequired,
  milestone: PT.object.isRequired,
  theme: PT.string,
  updateMilestoneContent: PT.func.isRequired,
}

export default MilestoneTypePhaseSpecification
