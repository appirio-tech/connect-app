require('./ProjectToolBar.scss')

import React, {PropTypes, Component} from 'react'
import { MenuBar, QuickLinks, UserDropdown,
        ConnectLogo, TopcoderMobileLogo, HamburgerIcon,
        Dropdown
      } from 'appirio-tech-react-components'

// properties: username, userImage, domain, mobileMenuUrl, mobileSearchUrl, searchSuggestionsFunc
// searchSuggestionsFunc should return a Promise object

class ProjectToolBar extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {domain, project, recentProjects} = this.props

    //TODO prepare navigation items according to roles of the user
    const primaryNavigationItems = [
      { 
        //img: require('./nav-projects.svg'),
        text: 'Dashboard',
        link: '/projects/dashboard',
        regex: '/dashboard?\?',
        selected: true
      },
      { 
        //img: require('./nav-projects.svg'),
        text: 'Challenges',
        link: '/projects/challenges',
        regex: '/challenges?\?',
        selected: true
      },
      { 
        //img: require('./nav-projects.svg'),
        text: 'Project Details',
        link: '/projects/details',
        regex: '/details?\?',
        selected: true
      },
      { 
        //img: require('./nav-projects.svg'),
        text: 'Sumbissions',
        link: '/projects/submissions',
        regex: '/submissions?\?',
        selected: true
      }
    ]
    return (
      <div className="ProjectToolBar flex middle space-between">
        <Dropdown pointerShadow>
          <a className="dropdown-menu-header">{ project.name }</a>
          <ul className="dropdown-menu-list">
            {
              recentProjects.map((recentProject, i) => {
                return <li key={i}><a href="javascript:;">{recentProject.name}</a></li>
              })
            }
          </ul>
        </Dropdown>
        <MenuBar items={primaryNavigationItems} orientation="horizontal" />
      </div>
    )
  }
}

ProjectToolBar.propTypes = {
  domain                : PropTypes.string.isRequired
}

ProjectToolBar.defaultProps = {
}

export default ProjectToolBar
