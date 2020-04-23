import React, { Component } from 'react'
import MediaQuery from 'react-responsive'
import Modal from 'react-modal'
import Sticky from 'react-stickynode'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { loadUserReportsUrls, setLookerSessionExpired } from '../actions'
import { SCREEN_BREAKPOINT_MD, PROJECT_REPORTS, REPORT_SESSION_LENGTH } from '../../../config/constants'
import TwoColsLayout from '../../../components/TwoColsLayout'
import UserSidebar from '../../../components/UserSidebar/UserSidebar'
import spinnerWhileLoading from '../../../components/LoadingSpinner'

const LookerEmbedReport = (props) => {
  return (<iframe width="100%" src={props.userReportsEmbedUrl} onLoad={props.onLoad} />)
}
  
const EnhancedLookerEmbedReport = spinnerWhileLoading(props => {
  return !props.isLoading
})(LookerEmbedReport)

class UserReportsContainer extends Component {
  constructor(props) {
    super(props)

    this.timer = null
    this.setLookerSessionTimer = this.setLookerSessionTimer.bind(this)
    this.reloadProjectReport = this.reloadProjectReport.bind(this)
  }

  reloadProjectReport() {
    this.props.loadUserReportsUrls(PROJECT_REPORTS.PROJECT_SUMMARY)
    // don't have to set session expire timer here, it would be set of iframe load
  }

  componentWillMount() {
    this.reloadProjectReport()
    // don't have to set session expire timer here, it would be set of iframe load
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  setLookerSessionTimer() {
    console.log('Setting Looker Session Timer')

    if (this.timer) {
      clearTimeout(this.timer)
    }

    // set timeout for raising alert to refresh the token when session expires
    this.timer = setTimeout(() => {
      console.log('Looker Session is expired by timer')
      this.props.setLookerSessionExpired(true)
      window.analytics && window.analytics.track('Looker Session Expired')
    }, REPORT_SESSION_LENGTH * 1000)
  }

  render() {
    const { user, isLoading, userReportsEmbedUrl, lookerSessionExpired } = this.props

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
          <Modal
            isOpen={lookerSessionExpired && !isLoading}
            className="delete-post-dialog"
            overlayClassName="delete-post-dialog-overlay"
            contentLabel=""
          >
            <div className="modal-title">
              Report sessions expired
            </div>

            <div className="modal-body">
              To keep the data up to date, please, hit "Refresh" button to reload the report.
            </div>

            <div className="button-area flex center action-area">
              <button className="tc-btn tc-btn-primary tc-btn-sm" onClick={this.reloadProjectReport}>Refresh</button>
            </div>
          </Modal>
          <EnhancedLookerEmbedReport
            isLoading={isLoading}
            userReportsEmbedUrl={userReportsEmbedUrl}
            onLoad={this.setLookerSessionTimer}
          />
        </TwoColsLayout.Content>
      </TwoColsLayout>
    )
  }
}
const mapStateToProps = ({ loadUser, userReports }) => {

  return {
    user: loadUser.user,
    isLoading: userReports.isLoading,
    lookerSessionExpired: userReports.lookerSessionExpired,
    userReportsEmbedUrl: userReports.userReportsEmbedUrl,
  }
}

const mapDispatchToProps = {
  loadUserReportsUrls,
  setLookerSessionExpired,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UserReportsContainer))