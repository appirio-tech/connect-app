import React from 'react'
import './ProjectSpecification.scss'
import Panel from '../Panel/Panel'
import ProjectType from '../ProjectType/ProjectType'
import ProjectSpecSidebar from '../../projects/detail/components/ProjectSpecSidebar'
import Specification from '../../projects/detail/containers/Specification'

const ProjectSpecification = ({ project, currentMemberRole }) => (
  <Panel className="panel-gray action-card">
    <div className="panel-specifications">
      <div className="specifications-title">
        { project.name }
      </div>
      <div className="specifications-platforms">
        <ProjectType type="" devices={ project.details.devices } />
      </div>
      <div className="specifications-list">
        <ProjectSpecSidebar project={ project } sections={ Specification.sections } currentMemberRole={ currentMemberRole } />
      </div>
    </div>
  </Panel>
)

export default ProjectSpecification
