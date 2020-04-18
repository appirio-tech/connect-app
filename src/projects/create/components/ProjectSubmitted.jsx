import React from 'react'
import PT from 'prop-types'

require('./ProjectSubmitted.scss')
import {
  CONNECT_DOMAIN
} from '../../../config/constants'

class ProjectSubmitted extends React.Component {
  constructor(props) {
    super(props)

    this.copyToClipboard = this.copyToClipboard.bind(this)
    this.state = {
      domain: `${CONNECT_DOMAIN}/`,
      url: `projects/${props.params.status || props.projectId}`
    }
  }

  copyToClipboard() {
    const textField = document.createElement('textarea')
    textField.innerText = `${this.state.domain}${this.state.url}`
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
            { `${this.state.domain}${this.state.url}` }
          </div>
          <div className="button-container flex row middle">
            <a type="button" onClick={this.copyToClipboard} className="copy-link-btn tc-btn tc-btn-sm tc-btn-default flex middle center" disabled={false}>Copy link</a>
            <a className="go-to-project-dashboard-btn tc-btn tc-btn-sm tc-btn-primary flex middle center" href={this.state.url} type="button"  disabled={false}>Go to project dashboard</a>
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
