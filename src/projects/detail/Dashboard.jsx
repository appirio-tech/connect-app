import React from 'react'
import ProjectInfoContainer from './containers/ProjectInfoContainer'
import FeedContainer from './containers/FeedContainer'
import Sticky from 'react-stickynode'

require('./Dashboard.scss')

const Dashboard = ({project, currentMemberRole}) => (
  <div>
    <div className="dashboard-container">
      <Sticky top={80}>
        <div className="left-area">
            <div className="dashboard-left-panel">
              <ProjectInfoContainer currentMemberRole={currentMemberRole} project={project} />
            </div>
        </div>
      </Sticky>
      <div className="right-area">
        <FeedContainer currentMemberRole={currentMemberRole} project={project} />
      </div>
    </div>
  </div>
)

export default Dashboard
