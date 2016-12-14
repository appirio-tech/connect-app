import React from 'react'
import { connect } from 'react-redux'
import ProjectInfoContainer from './containers/ProjectInfoContainer'
import FeedContainer from './containers/FeedContainer'
import Sticky from 'react-stickynode'
import spinnerWhileLoading from '../../components/LoadingSpinner'

require('./Dashboard.scss')

const DashboardView = ({project, currentMemberRole, route}) => (
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

const enhance = spinnerWhileLoading(props => !props.isLoading)
const EnhancedDashboardView = enhance(DashboardView)

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <EnhancedDashboardView {...this.props} />
  }
}

const mapStateToProps = ({ projectState }) => {
  return {
    isLoading      : projectState.isLoading
  }
}

export default connect(mapStateToProps)(Dashboard)
