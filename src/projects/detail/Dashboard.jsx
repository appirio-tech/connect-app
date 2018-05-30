import React from 'react'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import ProjectInfoContainer from './containers/ProjectInfoContainer'
import FeedContainer from './containers/FeedContainer'
import Sticky from 'react-stickynode'
import spinnerWhileLoading from '../../components/LoadingSpinner'
import { SCREEN_BREAKPOINT_MD } from '../../config/constants'
import TwoColsLayout from './components/TwoColsLayout'
import SidebarWithFooter from './components/SidebarWithFooter'

// import './Dashboard.scss'

const DashboardView = ({project, currentMemberRole, route, params, isSuperUser }) => {
  const leftArea = (
    <SidebarWithFooter>
      <ProjectInfoContainer
        currentMemberRole={currentMemberRole}
        project={project}
        isSuperUser={isSuperUser}
      />
    </SidebarWithFooter>
  )

  return (
    <TwoColsLayout>
      <TwoColsLayout.Sidebar>
        <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
          {(matches) => {
            if (matches) {
              return <Sticky top={60}>{leftArea}</Sticky>
            } else {
              return leftArea
            }
          }}
        </MediaQuery>
      </TwoColsLayout.Sidebar>
      <TwoColsLayout.Content>
        <FeedContainer
          currentMemberRole={currentMemberRole}
          project={project}
          route={route}
          params={params}
          isSuperUser={isSuperUser}
        />
      </TwoColsLayout.Content>
    </TwoColsLayout>
  )
}

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
