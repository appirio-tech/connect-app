import React from 'react'
import PT from 'prop-types'
import ProjectBudgetReport from './ProjectBudgetReport'
import TopcoderDifferenceReport  from './TopcoderDifferenceReport'
import PERMISSIONS from '../../../../config/permissions'
import { checkPermission } from '../../../../helpers/permissions'

import './ProjectSummaryReport.scss'

const ProjectSummaryReport = ({ projectSummary, project }) => {
  const { work, fees, revenue, remaining } = projectSummary.budget
  const hasBudgetPermission = checkPermission(PERMISSIONS.ACCESS_BUDGET_REPORT, project)
  const showBudgetSummary = hasBudgetPermission && (work || fees || revenue || remaining)
  const { countries, registrants, designs, linesOfCode, hoursSaved, costSavings, valueCreated } = projectSummary.topcoderDifference
  const showTopcoderDifference = countries || registrants || designs || linesOfCode || hoursSaved || costSavings || valueCreated
  const showEmptyProjectSummary = !showBudgetSummary && !showTopcoderDifference
  return (
    <div styleName="wrapper">
      { showEmptyProjectSummary &&
        <div>Sorry, we don't have any reports available for the project as of now. Please contact the account executive for any details.</div>
      }
      { !!showBudgetSummary &&
        <div styleName="budget-report">
          <ProjectBudgetReport budget={projectSummary.budget} project={project}/>
        </div>
      }
      { !!showTopcoderDifference && <TopcoderDifferenceReport difference={projectSummary.topcoderDifference}/> }
    </div>
  )
}

ProjectSummaryReport.propTypes = {
  projectSummary: PT.object.isRequired,
  project: PT.object.isRequired,
  template: PT.object.isRequired,
  estimationQuestion: PT.object.isRequired,
}

export default ProjectSummaryReport
