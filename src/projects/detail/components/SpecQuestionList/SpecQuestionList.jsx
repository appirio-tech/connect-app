import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import _ from 'lodash'

import IconUIPencil from '../../../../assets/icons/ui-pencil.svg'

require('./SpecQuestionList.scss')

const SpecQuestionList = ({ children, layout, additionalClass }) => {
  const directionClass = _.get(layout, 'direction', '')

  return (
    <div className={'spec-question-list ' + directionClass + ' ' + additionalClass}>
      { children }
    </div>
  )
}

SpecQuestionList.propTypes = {
  children: PropTypes.any.isRequired,
  /**
   * Layout of questions
   */
  layout: PropTypes.object,

  /**
   * additional class
   */
  additionalClass: PropTypes.string
}

SpecQuestionList.defaultProps = {
  additionalClass: ''
}

const SpecQuestionListItem = ({
  icon,
  title,
  type,
  additionalClass,
  titleAside,
  description,
  children,
  required,
  hideDescription,
  __wizard,
  startEditReadOnly,
  stopEditReadOnly,
  cancelEditReadOnly,
  readOptimized,
}) => {
  let shouldShowTitle = true
  let shouldShowRequire = false
  if (additionalClass.includes('spacing-gray-input') && (type === 'textinput')) {
    shouldShowTitle = false
    shouldShowRequire = true
  }
  return (
    <div className={ cn('spec-question-list-item', { [`${additionalClass}`] : true, 'read-optimized' : readOptimized }) }>
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
        <h5>
          { shouldShowTitle && (<div>{title}{required ? <span>*</span> : null}</div>) }
          {!!titleAside && <div className="spec-section-title-aside">{titleAside}</div>}
        </h5>
        {children && <div className="child-component">{children}</div>}
        {!hideDescription && <p className={cn({bigger: !icon})}>{description}</p>}
        {shouldShowRequire && (<div className="require-desc">{required ? 'Required' : 'Optional'}</div>) }
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
}

SpecQuestionListItem.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.any.isRequired,
  description: PropTypes.any,
  children: PropTypes.any,
  type: PropTypes.string,
  additionalClass: PropTypes.string
}

SpecQuestionListItem.defaultProps = {
  additionalClass: '',
}

SpecQuestionList.Item = SpecQuestionListItem

export default SpecQuestionList
