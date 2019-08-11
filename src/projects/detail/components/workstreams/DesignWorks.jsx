/**
 * DesignWorks section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import BackIcon from '../../../../assets/icons/arrows-16px-1_tail-left.svg'

class DesignWorks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { onBack } = this.props
    return (
      <div>
        Testing DesignWorks
        <div onClick={onBack} className="left-control">
          <i className="icon" title="back"><BackIcon /></i>
          <span className="back-icon-text">Back</span>
        </div>
      </div>
    )
  }
}

DesignWorks.defaultProps = {
  onBack: () => {},
}

DesignWorks.propTypes = {
  onBack: PT.func
}

export default withRouter(DesignWorks)
