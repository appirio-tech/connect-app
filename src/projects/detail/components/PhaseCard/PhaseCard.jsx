/**
 * PhaseCard component
 * phase summary with expandable content
 */
import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'
import cn from 'classnames'
import TextTruncate from 'react-text-truncate'

import {
  PHASE_STATUS,
  PHASE_STATUS_DRAFT,
  PHASE_STATUS_ACTIVE,
  PHASE_STATUS_COMPLETED,
  PROJECT_STATUS_COMPLETED,
  PROJECT_STATUS_CANCELLED,
  SCREEN_BREAKPOINT_MD,
  EVENT_TYPE,
} from '../../../../config/constants'

import ProjectProgress from '../../../../components/ProjectProgress/ProjectProgress'
import ProjectTypeIcon from '../../../../components/ProjectTypeIcon'
import LoadingIndicator from '../../../../components/LoadingIndicator/LoadingIndicator'
import MobilePage from '../../../../components/MobilePage/MobilePage'
import BackIcon from '../../../../assets/icons/arrow-left.svg'
import EditStageForm from './EditStageForm'
import NotificationsReader from '../../../../components/NotificationsReader'

import PERMISSIONS from '../../../../config/permissions'
import {checkPermission} from '../../../../helpers/permissions'

import './PhaseCard.scss'

class PhaseCard extends React.Component {
  constructor(props) {
    super(props)
    this.toggleCardView = this.toggleCardView.bind(this)
    this.toggleEditView = this.toggleEditView.bind(this)
    this.onClose = this.onClose.bind(this)

    this.state = {
      isExpanded: props.isExpanded,
      isEditting: false,
      isDetailView: false
    }
  }

  componentWillReceiveProps(nextProps) {
    // update phase finished successfully
    const nextState = {}
    if(nextProps.isUpdating === false && this.props.isUpdating === true) {
      // NOTE: following condition would be true for all stages after user updates only one of them
      // and we don't have phase id with update phase action reducer so we can't determine which card is updated
      // so we close all the edit forms for now
      nextState.isEditting = false
    }
    if (nextProps.isExpanded !== this.props.isExpanded) {
      nextState.isExpanded = nextProps.isExpanded
    }
    this.setState(nextState)
  }

  toggleCardView() {
    if (this.state.isExpanded) {
      this.props.collapseProjectPhase(this.props.phaseId)
    } else {
      this.props.expandProjectPhase(this.props.phaseId)
    }
  }

  toggleEditView(e) {
    e && e.stopPropagation()
    this.setState({
      isEditting: !this.state.isEditting
    })
  }

  onClose(){
    this.props.collapseProjectPhase(this.props.phaseId)
  }

  render() {
    const {
      attr,
      projectStatus,
      isManageUser,
      deleteProjectPhase,
      isUpdating,
      timeline,
      hasReadPosts,
      phaseId,
      isExpanded,
      project
    } = this.props
    const progressInPercent = attr.progressInPercent || 0

    let status = attr && attr.status ? attr.status : PHASE_STATUS_DRAFT
    status = _.find(PHASE_STATUS, s => s.value === status) ? status : PHASE_STATUS_DRAFT
    const statusDetails = _.find(PHASE_STATUS, s => s.value === status)

    const phaseEditable = checkPermission(PERMISSIONS.EDIT_PROJECT_PLAN, project) && status !== PHASE_STATUS_COMPLETED && projectStatus !== PROJECT_STATUS_CANCELLED && projectStatus !== PROJECT_STATUS_COMPLETED
    

    const hasUnseen = hasReadPosts

    return (
      <div styleName={'phase-card ' + (isExpanded ? ' expanded ' : ' ')} id={`phase-${phaseId}`}>
        <NotificationsReader 
          id={`phase-${phaseId}`}
          criteria={[
            { eventType: EVENT_TYPE.PROJECT_PLAN.PHASE_ACTIVATED, contents: { phaseId } },
            { eventType: EVENT_TYPE.PROJECT_PLAN.PHASE_COMPLETED, contents: { phaseId } },
            { eventType: EVENT_TYPE.PROJECT_PLAN.PHASE_PAYMENT_UPDATED, contents: { phaseId } },
            { eventType: EVENT_TYPE.PROJECT_PLAN.PHASE_PROGRESS_UPDATED, contents: { phaseId } },
          ]}
        />
        {
          <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
            {(matches) => (matches || !isExpanded ? (
              <div>
                <div styleName={cn('static-view', { 'has-unseen': hasUnseen && !isExpanded })} onClick={!this.state.isEditting && this.toggleCardView }>
                  <div styleName="col">
                    <div styleName="project-details">
                      <div styleName="project-ico">
                        <ProjectTypeIcon type={attr.icon} />
                      </div>
                      <div styleName="project-title-container">
                        <h4 styleName="project-title">
                          <TextTruncate
                            containerClassName="project-description"
                            line={!matches ? 2 : 5}
                            truncateText="..."
                            text={attr.title}
                          />
                        </h4>
                        {phaseEditable && !this.state.isEditting && (<a styleName="edit-btn" onClick={this.toggleEditView} />
                        )}
                      </div>
                      <div styleName="meta-list">
                        <span styleName="meta">{attr.duration}</span>
                        <span styleName="meta">{attr.startEndDates}</span>
                        {attr.posts && <span styleName="meta">{attr.posts}</span>}
                      </div>
                    </div>
                  </div>

                  { parseInt(attr.price, 10) > 0 && 
                    (<div styleName="col hide-md">
                      <div styleName="price-details">
                        <h5>{attr.price}</h5>
                        <div styleName="meta-list">{attr.paidStatus}</div>
                      </div>
                    </div>)
                  }

                  {status && status !== PHASE_STATUS_ACTIVE &&
                        (<div styleName="col show-md">
                          <div styleName="price-details">
                            <h5>{attr.price}</h5>
                            <div styleName="meta-list">
                              {status && (<span>{statusDetails.name}</span>)}
                            </div>
                          </div>
                        </div>)
                  }

                  {status && status === PHASE_STATUS_ACTIVE &&
                        (<div styleName="col show-md">
                          <div styleName="price-details">
                            <h5>{attr.price}</h5>
                            <div styleName="meta-list">
                              {!progressInPercent && status && (<span>{statusDetails.name}</span>)}
                              {progressInPercent !== 0 && (<span>{progressInPercent}% done</span>)}
                            </div>
                          </div>
                        </div>)
                  }

                  <div styleName="col hide-md">
                    {status && status !== PHASE_STATUS_ACTIVE &&
                          (<div styleName="status-details">
                            <div styleName={'status ' + (status ? status.toLowerCase() : '')}>
                              {statusDetails.name}
                            </div>
                          </div>)
                    }

                    {status && status === PHASE_STATUS_ACTIVE &&
                          (<div styleName="status-details">
                            <div styleName={'status ' + (status ? status.toLowerCase() : '')}>
                              <ProjectProgress
                                title=""
                                viewType={ProjectProgress.ViewTypes.CIRCLE}
                                percent={progressInPercent}
                                thickness={7}
                              >
                                <span className="progress-text">{progressInPercent}% <span className="unit">completed</span></span>
                              </ProjectProgress>

                            </div>
                          </div>)
                    }
                  </div>

                  {!this.state.isEditting && (<a styleName="toggle-arrow" />
                  )}

                  {status && status === PHASE_STATUS_ACTIVE &&
                        (
                          <div styleName="progressbar"><div styleName="fill" style={{ width: progressInPercent + '%' }} /></div>
                        )
                  }
                </div>

                {!this.state.isEditting && !!isExpanded && (<div styleName="expandable-view">
                  {this.props.children}
                </div>)}
                {isManageUser && this.state.isEditting && (
                  <div styleName="sm-separator">
                    {!isUpdating && (
                      <EditStageForm
                        phase={attr.phase}
                        phaseIndex={attr.phaseIndex}
                        cancel={this.toggleEditView}
                        timeline={timeline}
                        deleteProjectPhase={deleteProjectPhase}
                      />
                    )}
                    {isUpdating && <LoadingIndicator />}
                  </div>
                )}
              </div>
            ):(
              <MobilePage>
                <div styleName="mobile-phase">
                  <div styleName="header">
                    <div styleName="close-wrapper"><BackIcon onClick={this.onClose} /></div>
                    <div styleName="title">{attr.title}</div>
                    <div styleName="plug"/>
                  </div>
                  <div styleName="body">
                    <div styleName="expandable-view">
                      {this.props.children}
                    </div>
                  </div>
                </div>
              </MobilePage>
            ))
            }
          </MediaQuery>

        }



      </div>
    )
  }
}

PhaseCard.defaultProps = {
  posts: null,
}

PhaseCard.propTypes = {
  attr: PT.shape({
    duration: PT.string.isRequired,
    icon: PT.string.isRequired,
    paidStatus: PT.string.isRequired,
    posts: PT.string,
    startEndDates: PT.string.isRequired,
    status: PT.string.isRequired,
    title: PT.string.isRequired,
    hasReadPosts: PT.bool,
  }),
  phaseId: PT.number.isRequired,
  isExpanded: PT.bool,
}



const mapStateToProps = ({loadUser, projectState}) => {
  return {
    currentUserRoles: loadUser.user.roles,
    isUpdating: projectState.processing
  }
}

const actionCreators = {}

export default connect(mapStateToProps, actionCreators)(PhaseCard)
