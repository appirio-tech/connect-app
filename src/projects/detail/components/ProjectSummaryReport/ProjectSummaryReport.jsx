import React from 'react'
import PT from 'prop-types'
import ProjectEstimation from '../../../create/components/ProjectEstimation'
import ProjectBudgetReport from './ProjectBudgetReport'
import TopcoderDifferenceReport  from './TopcoderDifferenceReport'

import './ProjectSummaryReport.scss'

const ProjectSummaryReport = ({ projectSummary, project, template, estimationQuestion }) => {
  return (
    <div styleName="wrapper">
      {!!estimationQuestion &&
        <div styleName="project-estimation">
          <ProjectEstimation
            onClick={() => {}}
            question={estimationQuestion}
            template={template}
            project={project}
            theme="dashboard"
          />
        </div>
      }
      <div styleName="budget-report">
        <ProjectBudgetReport budget={projectSummary.projectSummary.budget}/>
      </div>
      <TopcoderDifferenceReport difference={projectSummary.projectSummary.topcoderDifference}/>
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
