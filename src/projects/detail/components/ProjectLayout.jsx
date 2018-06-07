import React from 'react'
import qs from 'query-string'
import SecondaryToolBarContainer from '../containers/SecondaryToolBarContainer'
import './ProjectLayout.scss'

class ProjectViewLayout extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    const location = this.props.location.pathname
    const isAddPhasePage = location && (location.substr(location.lastIndexOf('/') + 1) === 'add-phase')
    return (
      <div>
        <div styleName="secondary-toolbar">
          {!isAddPhasePage && (<SecondaryToolBarContainer />)}
        </div>
        {this.props.main}
      </div>
    )
  }
}

export default ProjectViewLayout
