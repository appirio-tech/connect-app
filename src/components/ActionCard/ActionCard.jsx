import React, {PropTypes} from 'react'
import './ActionCard.scss'
import Panel from '../Panel/Panel'
import cn from 'classnames'

const ActionCard = ({children, className}) => (
  <Panel className={cn('action-card', className)}>
    {children}
  </Panel>
)

ActionCard.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string
}

const Header = ({children, title}) => (
  <div className="panel-body">
    <div className="portrait">
      &nbsp;
    </div>
    <div className="object">
      <div className="card-header">
        <div className="card-title">
          {title}
        </div>
      </div>
      {children}
    </div>
  </div>
)

Header.propTypes = {
  children: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired
}

ActionCard.Header = Header

export default ActionCard
