import React from 'react'
import SecondaryToolBarContainer from '../containers/SecondaryToolBarContainer'
import './MetaDataLayout.scss'

class MetaDataLayout extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    const location = this.props.location.pathname
    return (
      <div styleName="container">
        <div styleName="secondary-toolbar">
          { /* pass location, to make sure that component is re-rendered when location is changed
                it's necessary to update the active state of the tabs */ }
          <SecondaryToolBarContainer location={location} />
        </div>
        {this.props.main}
      </div>
    )
  }
}

export default MetaDataLayout
