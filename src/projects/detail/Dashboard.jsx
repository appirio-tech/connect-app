import React from 'react'
import ProjectInfoContainer from './containers/ProjectInfoContainer'
import FeedContainer from './containers/FeedContainer'
import Sticky from 'react-stickynode'
import spinnerWhileLoading from '../../components/LoadingSpinner'

require('./Dashboard.scss')

// TODO right now spinner HOC is not working for loading icon in feeds section
// hence directly using the LoadingIndicator component in FeedContainer
const spinner = spinnerWhileLoading(props => !props.isLoading)
const EnhancedFeedContainer = spinner(FeedContainer)

const Dashboard = ({project, currentMemberRole}) => (
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
        <EnhancedFeedContainer currentMemberRole={currentMemberRole} project={project} />
      </div>
    </div>
  </div>
)

export default Dashboard
