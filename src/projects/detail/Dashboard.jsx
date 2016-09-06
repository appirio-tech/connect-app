import React from 'react'
import ProjectInfoContainer from './containers/ProjectInfoContainer'
import FeedContainer from './containers/FeedContainer'
import { Sticky } from 'react-sticky'

require('./Dashboard.scss')

const Dashboard = ({project, currentMemberRole}) => (
  <div>
    <div className="container">
      <div className="left-area">
        <Sticky>
          <div className="dashboard-left-panel">
            <ProjectInfoContainer currentMemberRole={currentMemberRole} project={project} />
          </div>
        </Sticky>
      </div>
      <div className="right-area">
        <FeedContainer currentMemberRole={currentMemberRole} project={project} />
      </div>
    </div>
  </div>
)

export default Dashboard