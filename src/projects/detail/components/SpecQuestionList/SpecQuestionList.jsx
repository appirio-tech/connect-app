import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import _ from 'lodash'

import HelpModal from '../../../create/components/HelpModal'

import './SpecQuestionList.scss'

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
  hideTitle,
  help,
}) => {
  let shouldShowTitle = true
  let shouldShowRequire = false
  if (additionalClass.includes('spacing-gray-input') && (type === 'textinput')) {
    shouldShowTitle = false
    shouldShowRequire = true
  }
  return (
    <div className={ cn('spec-question-list-item', additionalClass) }>
      {icon && <div className="icon-col">{icon}</div>}
      <div className="content-col">
        {!hideTitle && <h5>
          { shouldShowTitle && (<div>{title}{required ? <span>*</span> : null}</div>) }
          {!!titleAside && <div className="spec-section-title-aside">{titleAside}</div>}
          { help && (<HelpModal {...help} />) }
        </h5>}
        {children && <div className="child-component">{children}</div>}
        {!hideDescription && <p className={cn({bigger: !icon})}>{description}</p>}
        {shouldShowRequire && (<div className="require-desc">{required ? 'Required' : 'Optional'}</div>) }
      </div>
    </div>
  )
}

SpecQuestionListItem.propTypes = {
  icon: PropTypes.any,
  title: PropTypes.any,
  description: PropTypes.any,
  children: PropTypes.any,
  type: PropTypes.string,
  additionalClass: PropTypes.string,
  hideTitle: PropTypes.bool,
}

SpecQuestionListItem.defaultProps = {
  additionalClass: '',
}

SpecQuestionList.Item = SpecQuestionListItem

export default SpecQuestionList
