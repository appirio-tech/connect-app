import React from 'react'
import ProjectInfoContainer from './containers/ProjectInfoContainer'
import FeedContainer from './containers/FeedContainer'
import { Sticky } from 'react-sticky'

const Dashboard = ({project, currentMemberRole}) => (
  <div>
    <div className="container" style={{display: 'flex', width: '1110px', margin: '50px auto'}}>
      <div style={{width: '360px', marginRight: '30px'}}>
        <Sticky>
          <div style={{paddingBottom: '50px'}}>
            <ProjectInfoContainer currentMemberRole={currentMemberRole} project={project} />
          </div>
        </Sticky>
      </div>
      <div style={{width: '720px'}}>
        <FeedContainer currentMemberRole={currentMemberRole} project={project} />
      </div>
    </div>
  </div>
)

export default Dashboard
