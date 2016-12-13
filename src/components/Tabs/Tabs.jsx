import React from 'react'
import uncontrollable from 'uncontrollable'
import cn from 'classnames'
require('./Tabs.scss')


const Tabs = ({activeKey, children, onSelect}) => {
  const renderTabPill = ({props: {title, eventKey}}) => (
    <li key={eventKey} onClick={function(e) { onSelect(eventKey, e)} } className={cn({active: activeKey === eventKey})}>
      <a>{title}</a>
    </li>
  )
  const activeChild = ({props: {eventKey}}) => eventKey === activeKey
  return (
    <div>
      <div className="tabs">
        <ul>
          {children.map(renderTabPill)}
        </ul>
      </div>
      <div className="tab-content">
        {children.filter(activeChild)[0]}
      </div>
    </div>
  )
}

Tabs.propTypes = {
  /**
   * Mark the Tab with a matching `eventKey` as active.
   */
  activeKey: React.PropTypes.any,

  /**
   * Callback fired when a Tab is selected.
   *
   * ```js
   * function (
   * 	Any eventKey,
   * 	SyntheticEvent event?
   * )
   *
   */
  onSelect: React.PropTypes.func
}


export default uncontrollable(Tabs, { activeKey: 'onSelect' })
