import React, {PropTypes} from 'react'

const Tab = ({children}) => <div>{children}</div>

Tab.propTypes = {
  /**
   * The unique key of the tab. Used by parent component.
   */
  eventKey: PropTypes.any.isRequired,

  /**
   * The tab title. Used by parent component.
   */
  title: PropTypes.string.isRequired,

  /**
   * The tab content
   */
  children: PropTypes.any.isRequired
}

export default Tab
