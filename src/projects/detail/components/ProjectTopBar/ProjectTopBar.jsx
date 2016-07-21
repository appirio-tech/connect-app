require('./ProjectTopBar.scss')

import React, {PropTypes, Component} from 'react'
import { LinkMenuBar } from 'appirio-tech-react-components'
import { connect } from 'react-redux'
import _ from 'lodash'

// properties: username, userImage, domain, mobileMenuUrl, mobileSearchUrl, searchSuggestionsFunc
// searchSuggestionsFunc should return a Promise object

class ProjectTopBar extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {project, userRoles} = this.props
    //TODO prepare navigation items according to roles of the user
    let primaryNavigationItems = [
      {
        //img: require('./nav-projects.svg'),
        text: 'Dashboard',
        link: `/projects/${project.id}/`,
      },
      {
        //img: require('./nav-projects.svg'),
        text: 'Project Details',
        link: `/projects/${project.id}/specification/`,
      },
      {
        //img: require('./nav-projects.svg'),
        text: 'Sumbissions',
        link: `/projects/${project.id}/submissions/`,
      }
    ]
    let isCopilotOrManager = !!_.find(userRoles, (r)=> {
      r = r.toLowerCase();
      return r.indexOf('copilot') > -1 || r.indexOf('manager') > -1
    })
    if (isCopilotOrManager) {
      primaryNavigationItems.splice(2, 0, {
        //img: require('./nav-projects.svg'),
        text: 'Challenges',
        link: `/projects/${project.id}/challenges/`,
      })
    }


    return (
      <div className="ProjectTopBar flex middle space-between">
        <h3>{ project.title }</h3>
        <MenuBar items={primaryNavigationItems} orientation="horizontal" forReactRouter={true}/>
      </div>
    )
  }
}
const mapStateToProps = ({currentProject}) => {
  return {
    isLoading: currentProject.isLoading,
    project: currentProject.project
  }
}

ProjectTopBar.propTypes = {
  userRoles : PropTypes.arrayOf(PropTypes.string).isRequired,
  project   : PropTypes.object.isRequired,
  isLoading : PropTypes.bool.isRequired
}

// TODO remove this once we have data coming from JWT
ProjectTopBar.defaultProps = {
  userRoles: ['Topcoder User']
}

export default connect(mapStateToProps)(ProjectTopBar)
