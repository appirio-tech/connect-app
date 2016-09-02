import React, {PropTypes} from 'react'
import './Panel.scss'
import cn from 'classnames'

// main container
const Panel = ({children, className}) => (
  <div className={cn('panel', className)}>
    {children}
  </div>
)

Panel.propTypes = {
  children: PropTypes.any.isRequired,
  className: PropTypes.string
}

const Title = ({children}) => (
  <div className="panel-title">
    {children}
  </div>
)

Title.propTypes = {
  children: PropTypes.any.isRequired
}

const AddBtn = ({children, onClick}) => (
  <a href="javascript:" onClick={onClick} className="btn-add" title={children}>
    <i className="plus"/>
  </a>
)

AddBtn.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func
}



const Body = ({children, active, className}) => (
  <div className={cn('panel-body', className, {active})}>
    {children}
  </div>
)

Body.propTypes = {
  children: PropTypes.any.isRequired,
  active: PropTypes.any
}

Panel.Title = Title
Panel.Body = Body
Panel.AddBtn = AddBtn

export default Panel
