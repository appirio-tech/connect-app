import React from 'react'
import './Demo3.scss'
import {Link} from 'react-router'
import ProjectInfoContainer from './containers/ProjectInfoContainer'
import FeedContainer from './containers/FeedContainer'

const Dashboard = () => (
  <div>
    <div>
      <Link to="/dashboard">Dashboard</Link>
      {' '}
      <Link to="/messages">Messages</Link>
    </div>

    <div className="container" style={{display: 'flex', width: '1110px', margin: '50px auto'}}>
      <div style={{width: '360px', marginRight: '30px'}}>
        <ProjectInfoContainer />
      </div>
      <div style={{width: '720px'}}>
        <FeedContainer />
      </div>
    </div>
  </div>
)
export default Dashboard
