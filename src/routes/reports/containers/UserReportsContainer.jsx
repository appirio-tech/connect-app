import React, { Component } from 'react'
import MediaQuery from 'react-responsive'
import Sticky from 'react-stickynode'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { SCREEN_BREAKPOINT_MD } from '../../../config/constants'
import TwoColsLayout from '../../../components/TwoColsLayout'
import UserSidebar from '../../../components/UserSidebar/UserSidebar'

import './UserReportsContainer.scss'

class UserReportsContainer extends Component {
  constructor(props) {
    super(props)
  }

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
                    <UserSidebar user={user} />
                  </Sticky>
                )
              } else {
                return <UserSidebar user={user} />
              }
            }}
          </MediaQuery>
        </TwoColsLayout.Sidebar>
        <TwoColsLayout.Content>
          <div styleName="container">
            <p>
              This content has been moved. Please contact{' '}
              <a href="mailto:support@topcoder.com">support@topcoder.com</a> to
              receive an emailed copy of your report.
            </p>
          </div>
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

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UserReportsContainer))
