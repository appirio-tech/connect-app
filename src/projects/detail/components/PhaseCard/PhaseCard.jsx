/**
 * PhaseCard component
 * phase summary with expandable content
 */
import React from 'react'
import PT from 'prop-types'

import {
  PROJECT_STATUS_DRAFT,
  PROJECT_STATUS_IN_REVIEW,
  PROJECT_STATUS_REVIEWED,
  PROJECT_STATUS_ACTIVE,
  PROJECT_STATUS_COMPLETED,
  PROJECT_STATUS_CANCELLED,
  PROJECT_STATUS_PAUSED,
} from '../../../../config/constants'

import ProjectProgress from '../../../../components/ProjectProgress/ProjectProgress'
import ProjectTypeIcon from '../../../../components/ProjectTypeIcon'
import EditStageForm from './EditStageForm'

import './PhaseCard.scss'

// map project statuses with displayed statuses
const toPhaseCardStatus = {
  [PROJECT_STATUS_DRAFT]: 'Planned',
  [PROJECT_STATUS_IN_REVIEW]: 'inprogress',
  [PROJECT_STATUS_REVIEWED]: 'inprogress',
  [PROJECT_STATUS_ACTIVE]: 'inprogress',
  [PROJECT_STATUS_COMPLETED]: 'Delivered',
  [PROJECT_STATUS_CANCELLED]: 'Planned',
  [PROJECT_STATUS_PAUSED]: 'Planned',
}

class PhaseCard extends React.Component {
  constructor(props) {
    super(props)
    this.toggleCardView = this.toggleCardView.bind(this)
    this.toggleEditView = this.toggleEditView.bind(this)

    this.state = {
      isExpanded: '',
      isEditting: false
    }
  }

  toggleCardView() {
    this.setState({
      isExpanded: !this.state.isExpanded
    })
  }

  toggleEditView() {
    this.setState({
      isEditting: !this.state.isEditting
    })
  }

  render() {
    const { attr } = this.props
    const status = attr && attr.status ? toPhaseCardStatus[attr.status] : null

    return (
      <div styleName={'phase-card ' + (this.state.isExpanded ? ' expanded ' : ' ')}>
        <div styleName="static-view">
          <div styleName="col">
            <div styleName="project-details">
              <div styleName="project-ico">
                <ProjectTypeIcon type={attr.icon} />
              </div>
              <div styleName="project-title-container">
                <h4 styleName="project-title">{attr.title}</h4>
                {!this.state.isEditting && !this.state.isExpanded && (<a styleName="edit-btn" onClick={this.toggleEditView} />
                )}
              </div>
              <div styleName="meta-list">
                <span styleName="meta">{attr.duration}</span>
                <span styleName="meta">{attr.startEndDates}</span>
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
                {!attr.progressInPercent && status && (<span>{status}</span>)}
                {attr.progressInPercent && (<span>{attr.progressInPercent || 0}% done</span>)}
              </div>
            </div>
          </div>

          <div styleName="col hide-md">
            {status && status.toLowerCase() !== 'inprogress' &&
              (<div styleName="status-details">
                <div styleName={'status ' + (status ? status.toLowerCase() : '')}>
                  {status}
                </div>
              </div>)
            }

            {status && status.toLowerCase() === 'inprogress' &&
              (<div styleName="status-details">
                <div styleName={'status ' + (status ? status.toLowerCase() : '')}>
                  <ProjectProgress
                    title=""
                    viewType={ProjectProgress.ViewTypes.CIRCLE}
                    percent={attr.progressInPercent || 0}
                    thickness={7}
                  >
                    <span className="progress-text">{attr.progressInPercent || 0}% <span className="unit">completed</span></span>
                  </ProjectProgress>

                </div>
              </div>)
            }
          </div>

          {!this.state.isEditting && (<a styleName="toggle-arrow" onClick={this.toggleCardView} />
          )}

          {status && status.toLowerCase() === 'inprogress' &&
            (
              <div styleName="progressbar"><div styleName="fill" style={{ width: (attr.progressInPercent || 0)+'%' }} /></div>
            )
          }
        </div>
        {!this.state.isEditting && (<div styleName="expandable-view">
          {this.props.children}
        </div>)}
        {this.state.isEditting && (<div styleName="sm-separator" >
          <EditStageForm phase={attr.phase} phaseIndex={attr.phaseIndex} cancel={this.toggleEditView} update={this.toggleEditView} />
        </div>)}

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
