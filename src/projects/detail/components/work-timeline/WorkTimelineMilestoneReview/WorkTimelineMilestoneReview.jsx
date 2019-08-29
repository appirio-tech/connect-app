/**
 * Milestone review section
 */
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'
import { withRouter, Link } from 'react-router-dom'

import HelpModal from '../../../../create/components/HelpModal'
import CompleteMilestoneButtonContainer from '../CompleteMilestoneButtonContainer'
import IndividualFeedbackRow from './IndividualFeedbackRow'
import GeneralFeedback from './GeneralFeedback'
import CloseIcon from  '../../../../../assets/icons/x-mark-black.svg'
import BackIcon from  '../../../../../assets/icons/arrows-16px-1_tail-left.svg'
import {
  MILESTONE_TYPE,
} from '../../../../../config/constants'
import styles from './WorkTimelineMilestoneReview.scss'

const helperContent = `
<div style="
line-height: 20px;
font-size: 13px;
display: flex;
flex-direction: column;
padding-left: 40px;
padding-right: 40px;
padding-bottom: 40px;
">
<strong style="
font-weight: 700;
color: #262628;
margin-bottom: 7px;
">Challenge Link</strong>
<a href="https://www.topcoder.com/challenges/12345678/?type=design" style="
color: #006dea;
margin-bottom: 27px;
">https://www.topcoder.com/challenges/12345678/?type=design</a>
<strong style="
font-weight: 700;
color: #262628;
margin-bottom: 7px;
">Overview</strong>
<ul style="
margin: 0;
list-style-type: initial;
margin-bottom: 27px;
margin-left: 17px;
">
<li style="
margin-bottom: 7px;
">Please note that this is the round 1 review – which means the work is currently in progress, and not yet completed.</li>
<li style="
margin-bottom: 7px;
">The feedback you provide during this 1 st round will allow the designers to take your feedback and continue refining the design until the end of the challenge, and before your final review (round 2).</li>
<li style="
margin-bottom: 7px;
">They will "go for the win" by updating, refining or completely redesigning their submissions.</li>
<li style="
">Everyone who submits can see all feedback that is provided (but not the designs). This allows everyone the same opportunity to do better and is intended to make every submission for the next phase that much stronger.</li>
</ul> <strong style="
font-weight: 700;
color: #262628;
margin-bottom: 7px;
">Next Steps</strong>
<ul style="
margin: 0;
list-style-type: decimal;
margin-bottom: 27px;
margin-left: 17px;
">
<li style="
margin-bottom: 7px;
">Please complete the review within 48 hours.</li>
<li style="
margin-bottom: 7px;
">Once you’ve completed the review by adding your comments to this document, please let your copilot or challenge architect know.</li>
<li>We will then share the feedback with the designers so that they can work on their final designs. </li> </ul> <strong style="
font-weight: 700;
color: #262628;
margin-bottom: 7px;
">Round 1 vs. Round 2</strong>
<span style="
color: #262628;
margin-bottom: 7px;
">Please note that Round 1 only requires the following screens to be submitted:</span>
<ul style="
margin: 0;
list-style-type: decimal;
margin-left: 17px;
">
<li style="
margin-bottom: 7px;
">Create Dashboard Page</li>
<li>View Gallery Page</li> </ul> </div>
`

export function WorkTimelineMilestoneReview(props) {
  const {
    milestone,
    isUpdatingMilestoneInfoWithProcessId,
    match: { params: { projectId, workstreamId, workId, milestoneId } },
    updateWorkMilestone,
    timeline,
  } = props
  const workDashboardUrl = `/projects/${projectId}`

  const isFinalDesign = milestone.type === MILESTONE_TYPE.FINAL_DESIGNS
  const generalFeedback = _.get(milestone, `details.content.${isFinalDesign ? 'finalDesigns' : 'checkpointReview'}.generalFeedback`, '')
  const designs = _.get(milestone, 'details.prevMilestoneContent.designs', [])
  const designsCheckpointReview = _.get(milestone, 'details.content.checkpointReview.designs', designs.map(() => ({feedback: '', isSelected: false}) ))
  const designsFinalReview = _.get(milestone, 'details.content.finalDesigns.designs', designs.map(() => ({place: null, isSelected: false}) ))

  let alreadySelected1Place = false
  let alreadySelected2Place = false
  let alreadySelected3Place = false
  _.forEach(designsFinalReview, (element) => {
    if (element && element.place === 1) {
      alreadySelected1Place = true
    }
    if (element && element.place === 2) {
      alreadySelected2Place = true
    }
    if (element && element.place === 3) {
      alreadySelected3Place = true
    }
  })

  return (
    <div
      className={cn(
        styles['container'],
        {
          [styles['is-updating']]: false,
        }
      )}
    >
      <div className={styles.header}>
        <Link
          to={`${workDashboardUrl}/workstreams/${workstreamId}/works/${workId}`}
          className={styles['left-control']}
        >
          <i className={styles.icon} title="back"><BackIcon /></i>
          <span className={styles['back-icon-text']}>Back</span>
        </Link>
        <span className={styles.title}>design review</span>
        <div className={styles['right-control']}>
          <Link
            to={workDashboardUrl}
            className={styles['icon-close']}
          >
            <CloseIcon />
          </Link>
        </div>
      </div>
      <HelpModal
        className={styles['help-link']}
        linkTitle="How to conduct a successful checkpoint review?"
        title="Adopt a Puppy iOS App Design Challenge"
        content={helperContent}
      />

      <GeneralFeedback
        isUpdatingMilestoneInfoWithProcessId={isUpdatingMilestoneInfoWithProcessId}
        generalFeedback={generalFeedback}
        progressId={designs.length}
        updateWorkMilestone={updateWorkMilestone}
        milestoneType={milestone.type}
        timelineId={timeline.id}
      />

      <CompleteMilestoneButtonContainer
        className={styles['complete-milestone']}
        workId={parseInt(workId)}
        timelineId={timeline.id}
        milestoneId={parseInt(milestoneId)}
        onComplete={() => {  props.history.push(`${workDashboardUrl}/workstreams/${workstreamId}/works/${workId}`) }}
      />
      <span className={styles['section-title']}>Individual Feedback</span>
      <span className={styles['section-sub-title']}>Please provide specific feedback for each submission and select the top 5 designs</span>
      <div className={styles['work-list']}>
        {designs.map((design, index) => {
          const designCheckpointReview = _.get(designsCheckpointReview, `[${index}]`, {})
          const designFinalReview = _.get(designsFinalReview, `[${index}]`, {})
          return (
            <IndividualFeedbackRow
              key={design.submissionId}
              design={design}
              designCheckpointReview={designCheckpointReview}
              designFinalReview={designFinalReview}
              isUpdatingMilestoneInfoWithProcessId={isUpdatingMilestoneInfoWithProcessId}
              updateWorkMilestone={updateWorkMilestone}
              indexOfDesign={index}
              milestoneType={milestone.type}
              alreadySelected1Place={alreadySelected1Place}
              alreadySelected2Place={alreadySelected2Place}
              alreadySelected3Place={alreadySelected3Place}
              progressIdForSelectingWorkPlace={designs.length + 1}
              progressIdForGeneralFeedback={designs.length}
              milestone={milestone}
              totalDesign={designs.length}
              timelineId={timeline.id}
            />
          )
        })}
      </div>

    </div>
  )
}

WorkTimelineMilestoneReview.defaultProps = {
}

WorkTimelineMilestoneReview.propTypes = {
  milestone: PT.shape({
    id: PT.number,
    startDate: PT.string,
    endDate: PT.string,
    name: PT.string,
    details: PT.shape({
      content: PT.shape({
        checkpointReview: PT.shape({
          generalFeedback: PT.string
        })
      }),
      prevMilestoneContent: PT.shape({
        designs: PT.arrayOf(PT.shape({
          title: PT.string,
        }))
      })
    })
  }).isRequired,
  isUpdatingMilestoneInfoWithProcessId: PT.object.isRequired,
  updateWorkMilestone: PT.func.isRequired,
  timeline: PT.shape({
    id: PT.number.isRequired,
    startDate: PT.string,
    milestones: PT.arrayOf(PT.shape({
      id: PT.number.isRequired,
      startDate: PT.string,
      endDate: PT.string,
      name: PT.string.isRequired,
    })),
  }).isRequired,
}

export default withRouter(WorkTimelineMilestoneReview)
