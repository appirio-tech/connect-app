import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import _ from 'lodash'

import IconUIPencil from '../../../../assets/icons/ui-pencil.svg'

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

const SpecQuestionListItem = ({
  icon,
  title,
  description,
  children,
  required,
  hideDescription,
  __wizard,
  startEditReadOnly,
  stopEditReadOnly,
  cancelEditReadOnly,
}) => (
  <div className="spec-question-list-item">
    {icon && <div className="icon-col">{icon}</div>}
    <div className="content-col">
      {_.get(__wizard, 'readOnly') && (
        <button
          type="button"
          className="spec-section-edit-button"
          onClick={() => startEditReadOnly(_.get(__wizard, 'step'))}
        >
          <IconUIPencil />
        </button>
      )}
      <h5>{title}{required ? <span>*</span> : null}</h5>
      {children && <div className="child-component">{children}</div>}
      {!hideDescription && <p className={cn({bigger: !icon})}>{description}</p>}
      {_.get(__wizard, 'editReadOnly') && (
        <div className="spec-section-actions">
          <button
            type="button"
            className="tc-btn tc-btn-default tc-btn-md"
            onClick={() => cancelEditReadOnly(_.get(__wizard, 'step'))}
          >
            Cancel
          </button>
          <button
            type="button"
            className="tc-btn tc-btn-primary tc-btn-md"
            onClick={() => stopEditReadOnly(_.get(__wizard, 'step'))}
          >
            Update
          </button>
        </div>
      )}
    </div>
  </div>
)

SpecQuestionListItem.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.any.isRequired,
  description: PropTypes.any,
  children: PropTypes.any
}

SpecQuestionList.Item = SpecQuestionListItem

export default SpecQuestionList
