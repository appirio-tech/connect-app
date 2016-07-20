require('./ProjectToolBar.scss')

import React, {PropTypes, Component} from 'react'
import { MenuBar, Dropdown } from 'appirio-tech-react-components'

// properties: username, userImage, domain, mobileMenuUrl, mobileSearchUrl, searchSuggestionsFunc
// searchSuggestionsFunc should return a Promise object

class ProjectToolBar extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {project} = this.props

    //TODO prepare navigation items according to roles of the user
    const primaryNavigationItems = [
      {
        //img: require('./nav-projects.svg'),
        text: 'Dashboard',
        link: `/projects/${project.id}/`,
        regex: '/dashboard?\?',
        selected: true
      },
      {
        //img: require('./nav-projects.svg'),
        text: 'Challenges',
        link: `/projects/${project.id}/challenges/`,
        regex: '/challenges?\?',
        selected: true
      },
      {
        //img: require('./nav-projects.svg'),
        text: 'Project Details',
        link: `/projects/${project.id}/specification/`,
        regex: '/details?\?',
        selected: true
      },
      {
        //img: require('./nav-projects.svg'),
        text: 'Sumbissions',
        link: `/projects/${project.id}/submissions/`,
        regex: '/submissions?\?',
        selected: true
      }
    ]

    return (
      <div className="ProjectToolBar flex middle space-between">
        <h3>{ project.name }</h3>

        <MenuBar items={primaryNavigationItems} orientation="horizontal" />
      </div>
    )
  }
}

ProjectToolBar.propTypes = {
  project : PropTypes.object.isRequired
}

ProjectToolBar.defaultProps = {
}

export default ProjectToolBar
