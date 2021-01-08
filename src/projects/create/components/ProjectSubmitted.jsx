import React from 'react'
import PT from 'prop-types'
import qs from 'query-string'

require('./ProjectSubmitted.scss')
import {
  CONNECT_MAIN_PAGE_URL, PROJECT_TYPE_TALENT_AS_A_SERVICE, TAAS_APP_URL
} from '../../../config/constants'

/**
 * Build project URL based on the `type` query param in URL.
 *
 * @param {String} projectId project id
 */
const formatProjectURL = (projectId = '') => {
  const { type } = qs.parse(window.location.search)

  const url = type === PROJECT_TYPE_TALENT_AS_A_SERVICE
    // if the project type is TaaS, then use link to TaaS App
    ? `${TAAS_APP_URL}/myteams/${projectId}`
    // otherwise use link inside Connect App
    : `${CONNECT_MAIN_PAGE_URL}/projects/${projectId}`

  return url
}

class ProjectSubmitted extends React.Component {
  render() {
    const projectUrl = formatProjectURL(this.props.params.status || this.props.projectId)
    const projectsListUrl = formatProjectURL()

    return (
      <div className="ProjectSubmitted flex column middle center tc-ui">
        <div className="container flex column middle center">
          <div className="title">Congratulations!</div>
          <div className="sub-title">Your project has been created</div>
          <div className="content">
            Topcoder will be contacting you soon to discuss your project proposal.
            <br />
            <br />
            <span>
In the meantime, get a jump on the process by inviting your coworkers to your project and securely share any detailed requirements documents you have inside your project.
            </span>
          </div>
          <div className="button-container flex row middle center">
            <a type="button" href={projectUrl} className="go-to-project-btn tc-btn tc-btn-sm tc-btn-default flex middle center" disabled={false}>
              Go to Project
              <small>Invite your team members and share requirements</small>
            </a>
            <a href={projectsListUrl} type="button" className="go-to-project-dashboard-btn tc-btn tc-btn-sm tc-btn-primary flex middle center" disabled={false}>
              All Projects
              <small>View all of your projects</small>
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
