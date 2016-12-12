import React from 'react'
import ProjectInfoContainer from './containers/ProjectInfoContainer'
import FeedContainer from './containers/FeedContainer'
import Sticky from 'react-stickynode'

require('./Dashboard.scss')

const Dashboard = ({project, currentMemberRole, route}) => (
  <div>
    <div className="dashboard-container">
      <div className="left-area">
        <Sticky top={80}>
          <div className="dashboard-left-panel">
            <ProjectInfoContainer currentMemberRole={currentMemberRole} project={project} />
          </div>
        </Sticky>
      </div>
      <div className="right-area">
        <FeedContainer currentMemberRole={currentMemberRole} project={project} route={route} />
      </div>
    </div>
  </div>
)

export default Dashboard
