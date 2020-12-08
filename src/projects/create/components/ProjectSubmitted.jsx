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
const formatProjectURL = (projectId) => {
  const { type } = qs.parse(window.location.search)

  const url = type === PROJECT_TYPE_TALENT_AS_A_SERVICE
    // if the project type is TaaS, then use link to TaaS App
    ? `${TAAS_APP_URL}/myteams/${projectId}`
    // otherwise use link inside Connect App
    : `${CONNECT_MAIN_PAGE_URL}/projects/${projectId}`

  return url
}

class ProjectSubmitted extends React.Component {
  constructor(props) {
    super(props)

    this.copyToClipboard = this.copyToClipboard.bind(this)
  }

  copyToClipboard() {
    const url = formatProjectURL(this.props.params.status || this.props.projectId)
    const textField = document.createElement('textarea')
    textField.innerText = url
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

  render() {
    const url = formatProjectURL(this.props.params.status || this.props.projectId)

    return (
      <div className="ProjectSubmitted flex column middle center tc-ui">
        <div className="container flex column middle center">
          <div className="title">Congratulations!</div>
          <div className="sub-title">Your project has been submitted</div>
          <div className="content">
            A member of our team will be reaching out to you shortly to finalize the scope and build your project plan.
            <br />
            <br />
            Use the link below to share your project with members of your team. You can also access all your Topcoder projects in one place from your Connect project dashboard.
          </div>
          <div className="project-link-container flex row middle center">
            <a href={url}>{url.replace('https://', '')}</a>
          </div>
          <div className="button-container flex row middle center">
            <a type="button" onClick={this.copyToClipboard} className="copy-link-btn tc-btn tc-btn-sm tc-btn-default flex middle center" disabled={false}>Copy link</a>
            <a href={url} type="button" className="go-to-project-dashboard-btn tc-btn tc-btn-sm tc-btn-primary flex middle center" disabled={false}>Go to project dashboard</a>
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
