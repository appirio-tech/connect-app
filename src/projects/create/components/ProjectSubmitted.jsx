import React from 'react'
import PT from 'prop-types'
import qs from 'query-string'

require('./ProjectSubmitted.scss')
import {
  CONNECT_DOMAIN, PROJECT_TYPE_TALENT_AS_A_SERVICE, TAAS_APP_URL
} from '../../../config/constants'

class ProjectSubmitted extends React.Component {
  constructor(props) {
    super(props)

    const { type } = qs.parse(props.location.search)
    const projectId = props.params.status || props.projectId

    const url = type === PROJECT_TYPE_TALENT_AS_A_SERVICE
      // if the project type is TaaS, then use link to TaaS App
      ? `${TAAS_APP_URL}/myteams/${projectId}`
      // otherwise use link inside Connect App
      : `${CONNECT_DOMAIN}/projects/${projectId}`

    this.copyToClipboard = this.copyToClipboard.bind(this)
    this.state = {
      url
    }
  }

  copyToClipboard() {
    const textField = document.createElement('textarea')
    textField.innerText = `${this.state.url}`
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

  render() {
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
            <a href={this.state.url}>{this.state.url}</a>
          </div>
          <div className="button-container flex row middle center">
            <a type="button" onClick={this.copyToClipboard} className="copy-link-btn tc-btn tc-btn-sm tc-btn-default flex middle center" disabled={false}>Copy link</a>
            <a href={this.state.url} type="button" className="go-to-project-dashboard-btn tc-btn tc-btn-sm tc-btn-primary flex middle center" disabled={false}>Go to project dashboard</a>
          </div>
        </div>
      </div>
    )
  }
}

ProjectSubmitted.defaultProps = {
  vm: {},
  params: {},
}

ProjectSubmitted.propTypes = {
  vm: PT.any,
  params: PT.any,
}

export default ProjectSubmitted
