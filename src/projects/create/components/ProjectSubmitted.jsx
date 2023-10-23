import React from 'react'
import PT from 'prop-types'
import qs from 'query-string'

require('./ProjectSubmitted.scss')
import {
  CONNECT_MAIN_PAGE_URL, PROJECT_TYPE_TALENT_AS_A_SERVICE
} from '../../../config/constants'

class ProjectSubmitted extends React.Component {
  /**
   * Build project URL based on the `type` query param in URL.
   *
   * @param {String} projectId project id
   */
  getProjectUrl(projectId = '') {
    return `${CONNECT_MAIN_PAGE_URL}/projects/${projectId}`
  }

  getPageConfiguration() {
    const { type } = qs.parse(window.location.search)
    const isTaas  = type === PROJECT_TYPE_TALENT_AS_A_SERVICE

    const projectId = this.props.params.status || this.props.projectId

    const project = {
      headerSubTitle: 'Your project has been created',
      textBody: (
        <div className="content">
            Topcoder will be contacting you soon to discuss your project proposal.
          <br />
          <br />
          <span>
In the meantime, get a jump on the process by inviting your coworkers to your project and securely share any detailed requirements documents you have inside your project.
          </span>
        </div>
      ),
      leftButton: {
        header: 'All Projects',
        subText: 'View all of your projects',
        url: this.getProjectUrl()
      },
      rightButton: {
        header: 'Go to Project',
        subText: 'Invite your team members and share requirements',
        url: this.getProjectUrl(projectId)
      },
    }

    const taas = {
      headerSubTitle: 'Your talent request has been created',
      textBody: (
        <div className="content">
            Topcoder will be contacting you soon to discuss your talent needs.
        </div>
      ),
      leftButton: {
        header: 'All Projects',
        subText: 'View all of your projects',
        url: this.getProjectUrl() // also showing link to Connect App Project List
      },
      rightButton: {
        header: 'Go to Project',
        subText: 'Invite your team members and share requirements',
        url: this.getProjectUrl(projectId)
      },
    }

    return isTaas? taas: project
  }

  render() {

    const {
      headerSubTitle,
      textBody,
      leftButton,
      rightButton
    } = this.getPageConfiguration()

    return (
      <div className="ProjectSubmitted flex column middle center tc-ui">
        <div className="container flex column middle center">
          <div className="title">Congratulations!</div>
          <div className="sub-title">{headerSubTitle}</div>
          {textBody}
          <div className="button-container flex row middle center">
            <a type="button" href={leftButton.url} className="go-to-project-btn tc-btn tc-btn-sm tc-btn-default flex middle center">
              {leftButton.header}
              <small>{leftButton.subText}</small>
            </a>
            <a href={rightButton.url} type="button" className="go-to-project-dashboard-btn tc-btn tc-btn-sm tc-btn-primary flex middle center">
              {rightButton.header}
              <small>{rightButton.subText}</small>
            </a>
          </div>
        </div>
      </div>
    )
  }
}

ProjectSubmitted.defaultProps = {
  params: {},
}

ProjectSubmitted.propTypes = {
  vm: PT.any,
  params: PT.any,
}

export default ProjectSubmitted
