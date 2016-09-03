import React, {PropTypes} from 'react'
import Panel from '../Panel/Panel'
import ProjectType from '../ProjectType/ProjectType'
import ProjectStatus from '../ProjectStatus/ProjectStatus'
import ProjectProgress from '../ProjectProgress/ProjectProgress'

const ProjectInfo = ({type, devices, status, onChangeStatus, duration, budget}) => (
  <Panel>
    <Panel.Title>Project Info</Panel.Title>
    <ProjectType type={type} devices={devices} />
    <ProjectStatus status={status} onChangeStatus={onChangeStatus} />
    <ProjectProgress title="Duration" percent={duration.percent} type="completed">
      {duration.text}
    </ProjectProgress>
    <ProjectProgress title="Budget" percent={budget.percent} type="working">
      {budget.text}
    </ProjectProgress>
  </Panel>
)

ProjectInfo.propTypes = {
  type: PropTypes.string.isRequired,
  devices: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
  duration: PropTypes.object.isRequired,
  budget: PropTypes.object.isRequired
}

export default ProjectInfo
