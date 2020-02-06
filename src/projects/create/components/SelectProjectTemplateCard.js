import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import './SelectProjectTemplateCard.scss'
import IconOvalWrapper from './IconOvalWrapper'
import CurveVertical from '../../../assets/icons/v.2.5/curve-mask-vertical.svg'
import CurveHorizontal from '../../../assets/icons/v.2.5/curve-mask-horizontal.svg'
import IconArrowRight from '../../../assets/icons/arrows-16px-1_tail-right.svg'

function SelectProjectTemplateCard(p) {
  const { projectTemplate } = p

  const subTextHTML = projectTemplate.metadata.subTextHTML
  const detailLink = projectTemplate.metadata.detailLink
  const deliverables = projectTemplate.metadata.deliverables || []

  return (
    <div
      styleName={cn('SelectProjectTemplateCard', {
        'one-deliverable': deliverables.length === 1,
        'no-deliverable': deliverables.length === 0,
        'more-deliverable': deliverables.length > 1,
      })}
    >
      <div styleName="top-card">
        <div styleName="left-card">
          <div styleName="icon-wrapper">
            <IconOvalWrapper>
              {p.icon}
            </IconOvalWrapper>
          </div>
          <div styleName="left-card-content">
            <h3 styleName="header">{projectTemplate.name}</h3>
            <div styleName="details">{projectTemplate.info}</div>
            {(subTextHTML || detailLink) && (
              <div styleName="vertical-space" />
            )}
            {(subTextHTML || detailLink) && (
              <div styleName="learn-more-container">
                {subTextHTML && (
                  <div
                    dangerouslySetInnerHTML={{ __html: subTextHTML }}
                    styleName="starting-at"
                  />
                )}
                {detailLink && (
                  <a
                    styleName="learn-more"
                    href={detailLink}
                  >Learn More <IconArrowRight /></a>
                )}
              </div>
            )}
          </div>
        </div>
        <div styleName="vertical-curve-wrapper">
          <CurveVertical/>
        </div>
        <div styleName="right-card">
          {(deliverables.length === 1) && (
            <div
              styleName="info-html"
              dangerouslySetInnerHTML={{ __html: deliverables[0].infoHTML }}
            />
          )}
          <button
            className="tc-btn tc-btn-sm tc-btn-primary"
            onClick={p.onClick}
          >Select</button>
        </div>
      </div>
      {(deliverables.length > 0) && (
        <div styleName="bottom-card">
          <div styleName="horizontal-curve-wrapper">
            <CurveHorizontal/>
          </div>
          <div styleName="bottom-card-content">
            {deliverables.map(
              (item, i) =>
                (
                  <div key={i} styleName="bottom-column">
                    <div styleName="info-html" dangerouslySetInnerHTML={{ __html: item.infoHTML }} />
                    {item.subTextHTML && (
                      <div
                        dangerouslySetInnerHTML={{ __html: item.subTextHTML }}
                        styleName="starting-at"
                      />
                    )}
                    {(deliverables.length === 1) && (
                      <button
                        className="tc-btn tc-btn-sm tc-btn-primary"
                        onClick={p.onClick}
                      >Select</button>
                    )}
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </div>
  )
}

SelectProjectTemplateCard.defaultTypes = {
  onClick: _.noop
}

SelectProjectTemplateCard.propTypes = {
  icon: PT.element.isRequired,
  onClick: PT.func,
  projectTemplate: PT.any.isRequired
}

export default SelectProjectTemplateCard
