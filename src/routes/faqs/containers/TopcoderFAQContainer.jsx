import React, { Component } from 'react'
import MediaQuery from 'react-responsive'
import Sticky from 'react-stickynode'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { SCREEN_BREAKPOINT_MD } from '../../../config/constants'
import TwoColsLayout from '../../../components/TwoColsLayout'
import UserSidebar from '../../../components/UserSidebar/UserSidebar'
import { DASHBOARD_FAQ_CONTENT_ID } from '../../../config/constants'
import './TopcoderFAQContainer.scss'
import FAQContainer from '../../../components/FAQ/FAQContainer'

class TopcoderFAQContainer extends Component {

  render() {
    const { user } = this.props

    return (
      <TwoColsLayout noPadding>
        <TwoColsLayout.Sidebar>
          <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
            {(matches) => {
              if (matches) {
                return (
                  <Sticky top={60} bottomBoundary="#wrapper-main">
                    <UserSidebar user={user}/>
                  </Sticky>
                )
              } else {
                return <UserSidebar user={user}/>
              }
            }}
          </MediaQuery>
        </TwoColsLayout.Sidebar>
        <TwoColsLayout.Content>
          <FAQContainer contentKey={DASHBOARD_FAQ_CONTENT_ID} pageTitle="How topcoder works" />
        </TwoColsLayout.Content>
      </TwoColsLayout>
    )
  }
}
const mapStateToProps = ({ loadUser }) => {

  return {
    user: loadUser.user,
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopcoderFAQContainer))