/**
 * PhaseCard component
 * phase summary with expandable content
 */
import React from 'react'
import PT from 'prop-types'

import {
  PHASE_STATUS_PLANNED,
  PHASE_STATUS_IN_PROGRESS,
  PHASE_STATUS_DELIVERED,
} from '../../../../config/constants'

import ProjectProgress from '../../../../components/ProjectProgress/ProjectProgress'
import ProjectTypeIcon from '../../../../components/ProjectTypeIcon'

import './PhaseCard.scss'

class PhaseCard extends React.Component {
  constructor(props) {
    super(props)
    this.toggleCardView = this.toggleCardView.bind(this)

    this.state = {
      isExpanded: ''
    }
  }

  toggleCardView() {
    this.setState({
      isExpanded: !this.state.isExpanded
    })
  }

  render() {
    const { attr } = this.props
    let status = attr && attr.status ? attr.status : null
    if (status !== PHASE_STATUS_PLANNED && status !== PHASE_STATUS_IN_PROGRESS &&  status !== PHASE_STATUS_DELIVERED) {
      status = PHASE_STATUS_PLANNED
    }
    const progressInPercent = attr.progressInPercent

    return (
      <div styleName={'phase-card ' + (this.state.isExpanded ? ' expanded ' : ' ')}>
        <div styleName="static-view">
          <div styleName="col">
            <div styleName="project-details">
              <div styleName="project-ico">
                <ProjectTypeIcon type={attr.icon} />
              </div>
              <h4 styleName="project-title">{attr.title}</h4>
              <div styleName="meta-list">
                <span styleName="meta">{attr.duration}</span>
                {attr.startEndDates && (<span styleName="meta">{attr.startEndDates}</span>)}
                {attr.posts && <span styleName="meta">{attr.posts}</span>}
              </div>
            </div>
          </div>
          <div styleName="col hide-md">
            <div styleName="price-details">
              <h5>{attr.price}</h5>
              <div styleName="meta-list">{attr.paidStatus}</div>
            </div>
          </div>


          <div styleName="col show-md">
            <div styleName="price-details">
              <h5>{attr.price}</h5>
              <div styleName="meta-list">
                {!progressInPercent && status && (<span>{status}</span>)}
                {progressInPercent && (<span>{progressInPercent || 0}% done</span>)}
              </div>
            </div>
          </div>

          <div styleName="col hide-md">
            {status && status !== PHASE_STATUS_IN_PROGRESS &&
              (<div styleName="status-details">
                <div styleName={'status ' + (status ? status.toLowerCase() : '')}>
                  {status}
                </div>
              </div>)
            }

            {status && status === PHASE_STATUS_IN_PROGRESS &&
              (<div styleName="status-details">
                <div styleName={'status ' + (status ? status.toLowerCase() : '')}>
                  <ProjectProgress
                    title=""
                    viewType={ProjectProgress.ViewTypes.CIRCLE}
                    percent={progressInPercent || 0}
                    thickness={7}
                  >
                    <span className="progress-text">{progressInPercent || 0}% <span className="unit">completed</span></span>
                  </ProjectProgress>

                </div>
              </div>)
            }
          </div>

          <a styleName="toggle-arrow"
            onClick={this.toggleCardView}
          />

          {status && status === PHASE_STATUS_IN_PROGRESS &&
            (
              <div styleName="progressbar"><div styleName="fill" style={{ width: (progressInPercent || 0)+'%' }} /></div>
            )
          }
        </div>
        <div styleName="expandable-view">
          {this.props.children}
        </div>
      </div>
    )
  }
}

PhaseCard.defaultProps = {
  progressInPercent: 0,
  posts: null,
}

PhaseCard.propTypes = {
  attr: PT.shape({
    duration: PT.string.isRequired,
    icon: PT.string.isRequired,
    isExpanded: PT.bool,
    paidStatus: PT.string.isRequired,
    posts: PT.string,
    progressInPercent: PT.number,
    startEndDates: PT.string.isRequired,
    status: PT.string.isRequired,
    title: PT.string.isRequired,
  })
}

export default PhaseCard
