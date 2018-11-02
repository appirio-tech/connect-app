import React from 'react'
import { connect } from 'react-redux'

import Sticky from 'react-stickynode'
import MediaQuery from 'react-responsive'

import MobilePage from '../../../components/MobilePage/MobilePage'
import TwoColsLayout from '../components/TwoColsLayout'
import ProjectInfoContainer from './ProjectInfoContainer'

import { SCREEN_BREAKPOINT_MD } from '../../../config/constants'

const FullscreenFeedContainer = ({
  activeFeedId,
  children,
  currentMemberRole,
  feeds,
  isSuperUser,
  onChannelClick,
  phases,
  project,
}) => (
  <MobilePage keepToolbar>
    <TwoColsLayout noSecondaryToolbar noPadding>
      <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
        <TwoColsLayout.Sidebar>
          <Sticky top={60}>
            <ProjectInfoContainer
              currentMemberRole={currentMemberRole}
              phases={phases}
              project={project}
              isSuperUser={isSuperUser}
              feeds={feeds}
              hideInfo
              hideLinks
              hideMembers
              onChannelClick={onChannelClick}
              activeChannelId={activeFeedId}
            />
          </Sticky>
        </TwoColsLayout.Sidebar>
      </MediaQuery>
      <TwoColsLayout.Content>
        {children}
      </TwoColsLayout.Content>
    </TwoColsLayout>
  </MobilePage>
)

const mapStateToProps = ({ projectState }) => ({
  phases: projectState.phases,
  project: projectState.project,
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(FullscreenFeedContainer)
