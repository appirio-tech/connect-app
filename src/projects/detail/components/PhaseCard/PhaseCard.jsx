/**
 * PhaseCard component
 * phase summary with expandable content
 */
import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import MediaQuery from 'react-responsive'

import {
  PHASE_STATUS,
  PHASE_STATUS_DRAFT,
  PHASE_STATUS_ACTIVE,
  PHASE_STATUS_COMPLETED,
  PROJECT_STATUS_COMPLETED,
  PROJECT_STATUS_CANCELLED,
  SCREEN_BREAKPOINT_MD
} from '../../../../config/constants'

import ProjectProgress from '../../../../components/ProjectProgress/ProjectProgress'
import ProjectTypeIcon from '../../../../components/ProjectTypeIcon'
import LoadingIndicator from '../../../../components/LoadingIndicator/LoadingIndicator'
import MobilePage from '../../../../components/MobilePage/MobilePage'
import BackIcon from '../../../../assets/icons/arrow-left.svg'
import EditStageForm from './EditStageForm'
import DeletePhase from './DeletePhase'

import './PhaseCard.scss'

class PhaseCard extends React.Component {
  constructor(props) {
    super(props)
    this.toggleCardView = this.toggleCardView.bind(this)
    this.toggleEditView = this.toggleEditView.bind(this)
    this.onClose = this.onClose.bind(this)

    this.state = {
      isExpanded: '',
      isEditting: false,
      isDetailView: false
    }
  }

  componentWillReceiveProps(nextProps) {
    // update phase finished successfully
    if(nextProps.isUpdating === false && this.props.isUpdating === true) {
      // NOTE: following condition would be true for all stages after user updates only one of them
      // and we don't have phase id with update phase action reducer so we can't determine which card is updated
      // so we close all the edit forms for now
      this.setState({
        isEditting: false
      })
    }
  }

  toggleCardView() {
    this.setState({
      isDetailView: true,
      isExpanded: !this.state.isExpanded

    })
  }

  toggleEditView(e) {
    e && e.stopPropagation()
    this.setState({
      isEditting: !this.state.isEditting
    })
  }

  onClose(){
    this.setState({
      isDetailView: false,
      isExpanded: false
    })
  }

  render() {
    const { attr, projectStatus, isManageUser, deleteProjectPhase, isUpdating, timeline } = this.props
    const progressInPercent = attr.progressInPercent || 0

    let status = attr && attr.status ? attr.status : PHASE_STATUS_DRAFT
    status = _.find(PHASE_STATUS, s => s.value === status) ? status : PHASE_STATUS_DRAFT
    const statusDetails = _.find(PHASE_STATUS, s => s.value === status)

    const phaseEditable = isManageUser && status !== PHASE_STATUS_COMPLETED && projectStatus !== PROJECT_STATUS_CANCELLED && projectStatus !== PROJECT_STATUS_COMPLETED
    const canDelete = status !== PHASE_STATUS_ACTIVE && status !== PHASE_STATUS_COMPLETED

    return (
      <div styleName={'phase-card ' + (this.state.isExpanded ? ' expanded ' : ' ')}>
        {
          <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
            {(matches) => (matches || !this.state.isDetailView ? (
              <div>
                <div styleName="static-view" onClick={!this.state.isEditting && this.toggleCardView }>
                  <div styleName="col">
                    <div styleName="project-details">
                      <div styleName="project-ico">
                        <ProjectTypeIcon type={attr.icon} />
                      </div>
                      <div styleName="project-title-container">
                        <h4 styleName="project-title">{attr.title}</h4>
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

                  <div styleName="col hide-md">
                    <div styleName="price-details">
                      <h5>{attr.price}</h5>
                      <div styleName="meta-list">{attr.paidStatus}</div>
                    </div>
                  </div>
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

                {!this.state.isEditting && (<div styleName="expandable-view">
                  {this.props.children}
                </div>)}
                {(<div styleName={'sm-separator ' + ((!isManageUser || !this.state.isEditting) ? 'hide ': '')} >
                  {!isUpdating && (
                    <EditStageForm
                      phase={attr.phase}
                      phaseIndex={attr.phaseIndex}
                      cancel={this.toggleEditView}
                      hasTimeline={!!timeline}
                    />
                  )}
                  {canDelete && !isUpdating && (
                    <DeletePhase
                      onDeleteClick={() => {
                        if (confirm(`Are you sure you want to delete phase '${attr.phase.name}'?`)) {
                          deleteProjectPhase()
                        }
                      }}
                    />
                  )}
                  {isUpdating && <LoadingIndicator />}
                </div>)}
              </div>
            ):(
              <MobilePage>
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
    isExpanded: PT.bool,
    paidStatus: PT.string.isRequired,
    posts: PT.string,
    startEndDates: PT.string.isRequired,
    status: PT.string.isRequired,
    title: PT.string.isRequired,
  })
}



const mapStateToProps = ({loadUser, projectState}) => {
  return {
    currentUserRoles: loadUser.user.roles,
    isUpdating: projectState.processing
  }
}

const actionCreators = {}

export default connect(mapStateToProps, actionCreators)(PhaseCard)
