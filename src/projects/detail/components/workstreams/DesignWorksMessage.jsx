/**
 * Input Design Works section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'

import './DesignWorksMessage.scss'

const DesignWorksMessage = ({ milestone }) => (
  <div styleName="input-design-work-container">
    <div styleName="title">{milestone.name} milestone reached</div>
    <div styleName="active-text">{milestone.activeText}</div>
    <button
      styleName="input-design-works-btn"
      className="tc-btn tc-btn-primary tc-btn-sm"
      onClick={() => {}}
    >Input Design Works</button>
  </div>
)

DesignWorksMessage.defaultProps = {
}

DesignWorksMessage.propTypes = {
  milestone: PT.shape({
    id: PT.number,
    startDate: PT.string,
    endDate: PT.string,
    name: PT.string,
    activeText: PT.string
  })
}

export default withRouter(DesignWorksMessage)