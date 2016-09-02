import React from 'react'
// import './Demo3.scss'
import ProjectInfoContainer from './containers/ProjectInfoContainer'
import FeedContainer from './containers/FeedContainer'

const Dashboard = ({project}) => (
  <div>
    <div className="container" style={{display: 'flex', width: '1110px', margin: '50px auto'}}>
      <div style={{width: '360px', marginRight: '30px'}}>
        <ProjectInfoContainer project={project} />
      </div>
      <div style={{width: '720px'}}>
        <FeedContainer project={project} />
      </div>
    </div>
  </div>
)

export default Dashboard
