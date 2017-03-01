import React, {PropTypes} from 'react'
import cn from 'classnames'
require('./SpecQuestionList.scss')

const SpecQuestionList = ({ children }) => {
  return (
    <div className="spec-question-list">
      { children }
    </div>
  )
}

SpecQuestionList.propTypes = {
  children: PropTypes.any.isRequired
}

const SpecQuestionListItem = ({icon, title, description, children}) => (
  <div className="spec-question-list-item">
    {icon && <div className="icon-col">{icon}</div>}
    <div className="content-col">
      <h5>{title}</h5>
      {children && <div className="child-component">{children}</div>}
      <p className={cn({bigger: !icon})}>{description}</p>
    </div>
  </div>
)

SpecQuestionListItem.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.any.isRequired,
  description: PropTypes.any.isRequired,
  children: PropTypes.any
}

SpecQuestionList.Item = SpecQuestionListItem

export default SpecQuestionList
