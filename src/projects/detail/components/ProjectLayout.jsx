import React from 'react'
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
      <div styleName="container">
        <div styleName="secondary-toolbar">
          { /* pass location, to make sure that component is re-rendered when location is changed
                it's necessary to update the active state of the tabs */ }
          {!isAddPhasePage && (<SecondaryToolBarContainer location={location} />)}
        </div>
        {this.props.main}
      </div>
    )
  }
}

export default ProjectViewLayout
