import React, {PropTypes} from 'react'
import Panel from '../Panel/Panel'
import ProjectType from '../ProjectType/ProjectType'
import ProjectStatus from '../ProjectStatus/ProjectStatus'
import ProjectProgress from '../ProjectProgress/ProjectProgress'

//const ProjectInfo = ({type, directLinks, devices, currentMemberRole, status, onChangeStatus, duration, budget}) => (
// TODO: Enable 'budget' when is needed again.
const ProjectInfo = ({type, directLinks, devices, currentMemberRole, status, onChangeStatus, duration}) => (
  <Panel>
    <Panel.Title>Project Info</Panel.Title>
    <ProjectType type={type} devices={devices} />
  <ProjectStatus directLinks={directLinks} currentMemberRole={currentMemberRole} status={status} onChangeStatus={onChangeStatus} />
    <ProjectProgress title="Duration" percent={duration.percent} type="completed">
      {duration.text}
    </ProjectProgress>
    {/*
    <ProjectProgress title="Budget" percent={budget.percent} type="working">
      {budget.text}
    </ProjectProgress>
    */}
  </Panel>
)

ProjectInfo.propTypes = {
  currentMemberRole: PropTypes.string,
  type: PropTypes.string.isRequired,
  devices: PropTypes.array.isRequired,
  directLinks: PropTypes.array,
  status: PropTypes.string.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
  duration: PropTypes.object.isRequired,
  budget: PropTypes.object.isRequired
}

export default ProjectInfo
