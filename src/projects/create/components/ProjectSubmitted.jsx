import React from 'react'
import PT from 'prop-types'

require('./ProjectSubmitted.scss')
class ProjectSubmitted extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      url: `projects/${props.params.status || props.projectId}`
    }
  }

  render() {
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
            <a type="button" href={this.state.url} className="go-to-project-btn tc-btn tc-btn-sm tc-btn-default flex middle center" disabled={false}>
              Go to Project
              <small>Invite your team members and share requirements</small>
            </a>
            <a href="projects" type="button" className="go-to-project-dashboard-btn tc-btn tc-btn-sm tc-btn-primary flex middle center" disabled={false}>
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
  vm: {},
  params: {},
}

ProjectSubmitted.propTypes = {
  vm: PT.any,
  params: PT.any,
}

export default ProjectSubmitted
