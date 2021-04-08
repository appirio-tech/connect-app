import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
// import { unflatten } from 'flat'

import styles from './EditStageForm.scss'
import { connect } from 'react-redux'
import { withRouter, Prompt } from 'react-router-dom'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
const TCFormFields = FormsyForm.Fields
// import enhanceDropdown from 'appirio-tech-react-components/components/Dropdown/enhanceDropdown'
import { updatePhase as updatePhaseAction, firePhaseDirty, firePhaseDirtyUndo } from '../../../actions/project'
import LoadingIndicator from '../../../../components/LoadingIndicator/LoadingIndicator'
import { PHASE_STATUS_COMPLETED, PHASE_STATUS_ACTIVE, PHASE_STATUS_DRAFT } from '../../../../config/constants'
import DeletePhase from './DeletePhase'
import { hasPermission } from '../../../../helpers/permissions'
import { PERMISSIONS } from '../../../../config/permissions'
import { isValidStartEndDates } from '../../../../helpers/utils'

const moment = extendMoment(Moment)

class EditStageForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      publishClicked: false,
      isUpdating: false,
      isEdittable: (_.get(props, 'phase.status') !== PHASE_STATUS_COMPLETED) || (_.get(props, 'canEditCompletedPhase')),
      showPhaseOverlapWarning: false,
      phaseIsdirty: false,
      showActivatingWarning: false,
    }
    this.submitValue = this.submitValue.bind(this)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onCancel = this.onCancel.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.showActivatingWarning = this.showActivatingWarning.bind(this)
    this.cancelActivatingPhase = this.cancelActivatingPhase.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onPublishClick = this.onPublishClick.bind(this)
  }

  showActivatingWarning() {
    this.setState({
      showActivatingWarning: true,
    })
  }

  cancelActivatingPhase() {
    this.setState({
      publishClicked: false,
      showActivatingWarning: false,
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isUpdating: nextProps.isUpdating,
      isEdittable: nextProps.phase.status !== PHASE_STATUS_COMPLETED || nextProps.canEditCompletedPhase,
    })
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onLeave)
  }

  componentWillUnmount() {
    this.props.firePhaseDirtyUndo()
    window.removeEventListener('beforeunload', this.onLeave)
  }

  submitValue(model) {
    const { phase, phaseIndex, updatePhaseAction } = this.props
    const {
      publishClicked
    } = this.state
    const updatedStartDate = moment.utc(new Date(model.startDate))
    const updatedEndDate = model.status === PHASE_STATUS_COMPLETED ? moment.utc(new Date()) : moment.utc(model.endDate)
    let newStatus = phase.status
    if (publishClicked && phase.status === PHASE_STATUS_DRAFT) {
      newStatus = PHASE_STATUS_ACTIVE
    }
    const updateParam = _.assign({}, model, {
      startDate: updatedStartDate,
      endDate: updatedEndDate || '',
      status: newStatus
    })
    this.setState({
      isUpdating: true,
      publishClicked: false
    })
    updatePhaseAction(phase.projectId, phase.id, updateParam, phaseIndex)
  }

  onFormSubmit(model) {
    const { phase } = this.props
    const { showActivatingWarning, publishClicked } = this.state

    if (
      !showActivatingWarning &&
      publishClicked &&
      phase.status === PHASE_STATUS_DRAFT
    ) {
      this.showActivatingWarning()
    } else {
      this.submitValue(model)
    }
  }

  enableButton() {
    this.setState( { canSubmit: true })
  }

  disableButton() {
    this.setState({ canSubmit: false })
  }

  isChanged() {
    // We check if this.refs.form exists because this may be called before the
    // first render, in which case it will be undefined.
    return (this.refs.form && this.refs.form.isChanged())
  }

  // Notify user if they navigate away while the form is modified.
  onLeave(e = {}) {
    if (this.isChanged()) {
      return e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
    }
  }

  onCancel() {
    this.refs.form.reset()
    this.props.firePhaseDirtyUndo()
    this.setState({
      showPhaseOverlapWarning: false,
      phaseIsdirty: false,
    })
    this.props.cancel()
  }

  /**
   * when in draft status, click publish button
   */
  onPublishClick() {
    this.setState({
      publishClicked: true,
    })
  }
  /**
   * Handles the change event of the form.
   *
   * @param change changed form model in flattened form
   * @param isChanged flag that indicates if form actually changed from initial model values
   */
  handleChange(change) {
    const { phases, phase, phaseIndex } = this.props
    let showPhaseOverlapWarning = false
    // if start date's start day or end day is updated for a phase, we need to update other phases dates accordingly
    const phaseStartDay = moment.utc(new Date(phase.startDate)).format('YYYY-MM-DD')
    const changedStartDay = moment.utc(new Date(change.startDate)).format('YYYY-MM-DD')
    const phaseEndDay = moment.utc(new Date(phase.endDate)).format('YYYY-MM-DD')
    const changedEndDay = moment.utc(new Date(change.endDate)).format('YYYY-MM-DD')
    if (phaseStartDay !== changedStartDay || phaseEndDay !== changedEndDay) {
      // console.log('Need to sync phases')
      const reqChanges = this.checkOverlappingPhases(phases, phase, phaseIndex, change)
      //console.log('reqChanges : ', reqChanges)
      if (reqChanges && reqChanges.length > 0) {
        showPhaseOverlapWarning = true
      }
      //console.log('showPhaseOverlapWarning  : ', showPhaseOverlapWarning)
    } else {
      // No need to sync phases
      // console.log('No need to sync phases')
    }
    this.setState({
      showPhaseOverlapWarning
    })
    if (this.isChanged()) {
      // TODO fire dirty event for phase
      this.setState({
        phaseIsdirty: true
      })
      // this.props.firePhaseDirty(unflatten(change), this.props.phase.id)
    } else {
      // this.props.firePhaseDirtyUndo()
    }
  }

  checkOverlappingPhases(phases, refPhase, refPhaseIndex, updatedPhase) {
    // if startDate or endDate is not set in the current update, we don't need to do anything
    if (!updatedPhase.startDate || !updatedPhase.endDate) return false
    //Possible mutations
    //!date,!duration //both changed
    //!date,duration //date changed
    //date,!duration //duration changed
    const phasesToBeUpdated = []
    let overLapping = false
    const updatedPhaseStartDate = updatedPhase ? moment(new Date(updatedPhase.startDate)) : null
    const updatedPhaseEndDate = updatedPhase ? moment(new Date(updatedPhase.endDate)) : null
    const updatedPhaseRange = moment().range(updatedPhaseStartDate, updatedPhaseEndDate)
    for(let i =0; i < phases.length; i++) {
      overLapping = false
      if(i !== refPhaseIndex) {
        const currentStartDate = moment(new Date(phases[i].startDate))
        const currentEndDate = moment(new Date(phases[i].endDate))
        const currentPhaseRange = moment().range(currentStartDate, currentEndDate)
        if(currentPhaseRange.contains(updatedPhaseStartDate)) {
          overLapping = true
        } else if(currentPhaseRange.contains(updatedPhaseEndDate)) {
          overLapping = true
        } else if(updatedPhaseRange.contains(currentStartDate) && updatedPhaseRange.contains(currentEndDate)) {
          overLapping = true
        }
      }
      //pushing the phase if its overlapping with any
      if(overLapping) {
        phasesToBeUpdated.push({
          id: phases[i].id,
          startDate: moment(new Date(phases[i].startDate)),
          conflictingPhaseName: phases[i].name,
          conflictingPhaseIndex: i,
          updatedPhase: refPhase.name
        })
      }
    }
    return phasesToBeUpdated
  }

  render() {
    const { phase, isUpdating, deleteProjectPhase } = this.props
    const { isEdittable, showPhaseOverlapWarning, showActivatingWarning } = this.state
    let startDate = phase.startDate ? new Date(phase.startDate) : new Date()
    startDate = moment.utc(startDate).format('YYYY-MM-DD')
    let endDate = phase.endDate ? new Date(phase.endDate) : new Date()
    endDate = moment.utc(endDate).format('YYYY-MM-DD')
    const canDelete = phase.status !== PHASE_STATUS_ACTIVE && phase.status !== PHASE_STATUS_COMPLETED
    const isDraft = phase.status === PHASE_STATUS_DRAFT

    return (
      <div styleName="container">
        <Prompt
          when={this.state.phaseIsdirty}
          message="You have unsaved changes. Are you sure you want to leave? "
        />
        {this.state.isUpdating && (<LoadingIndicator />)}
        {!this.state.isUpdating && (<div>
          <Formsy.Form
            ref="form"
            disabled={!isEdittable}
            onInvalid={this.disableButton}
            onValid={this.enableButton}
            onValidSubmit={this.onFormSubmit}
            onChange={ this.handleChange }
          >
            <div styleName="form">
              { showPhaseOverlapWarning && <div className="error-message">
                Warning: You are about to manually change the start/end date of this phase, Please ensure the start and end dates of all subsequent phases (where applicable) are updated in line with this change.
              </div> }
              <div styleName="title-label-layer">
                <TCFormFields.TextInput
                  wrapperClass={`${styles['input-row']}`}

                  validations={{isRequired: true}}
                  validationError={'Please, enter title'}
                  required
                  label="Title"
                  type="text"
                  name="name"
                  value={phase.name}
                  maxLength={48}
                />
              </div>
              <div styleName="description-label-layer">
                <TCFormFields.TextInput
                  wrapperClass={`${styles['input-row']}`}
                  label="Description"
                  type="text"
                  name="description"
                  value={phase.description}
                  maxLength={255}
                />
              </div>
              <div styleName="label-layer">
                <TCFormFields.TextInput
                  wrapperClass={`${styles['input-row']}`}
                  validations={{
                    isRequired: true,
                    isValidStartEndDates
                  }}
                  validationError={'Please, enter start date'}
                  validationErrors={{
                    isValidStartEndDates: 'Start date cannot be after end date'
                  }}
                  required
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={startDate}
                />
                <TCFormFields.TextInput
                  wrapperClass={`${styles['input-row']}`}
                  validations={{
                    isRequired: true,
                    isValidStartEndDates
                  }}
                  validationError={'Please, enter end date'}
                  validationErrors={{
                    isValidStartEndDates: 'End date cannot be before start date'
                  }}
                  required
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={endDate}
                />
              </div>
              {!showActivatingWarning ? (
                <div styleName="group-bottom">
                  <button onClick={this.onCancel} type="button" className="tc-btn tc-btn-default"><strong>{'Cancel'}</strong></button>
                  <button className="tc-btn tc-btn-primary tc-btn-sm"
                    type="submit" disabled={(!this.isChanged() || isUpdating) || !this.state.canSubmit}
                  >Save Changes</button>
                  {isDraft ? (
                    <button
                      onClick={this.onPublishClick}
                      className="tc-btn tc-btn-primary tc-btn-sm"
                      type="submit" disabled={ isUpdating || !this.state.canSubmit}
                    >Publish</button>
                  ) : null}
                </div>
              ) : (
                <div styleName="message">
                  <h4 styleName="message-title">You are about to publish the phase</h4>
                  <p styleName="message-text">This action will permanently publish your phase and cannot be undone.</p>
                  <div styleName="group-bottom">
                    <button
                      className="tc-btn tc-btn-default tc-btn-sm"
                      type="button"
                      onClick={this.cancelActivatingPhase}
                    >
                      Cancel
                    </button>
                    <button
                      className="tc-btn tc-btn-warning tc-btn-sm"
                      type="submit"
                    >
                      OK
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Formsy.Form>
        </div>)}
        {canDelete && !showActivatingWarning && !isUpdating && (
          <DeletePhase
            onDeleteClick={() => {
              if (confirm(`Are you sure you want to delete phase '${phase.name}'?`)) {
                deleteProjectPhase()
              }
            }}
          />
        )}
      </div>
    )
  }
}

EditStageForm.defaultProps = {
  cancel: () => {}
}

EditStageForm.propTypes = {
  cancel: PT.func,
  deleteProjectPhase: PT.func.isRequired,
  phase: PT.object,
  phaseIndex: PT.number
}

const mapStateToProps = ({projectState, productsTimelines}) => ({
  isUpdating: projectState.processing,
  phases: projectState.phases,
  productsTimelines,
  canEditCompletedPhase: hasPermission(PERMISSIONS.MANAGE_COMPLETED_PHASE)
})

const actionCreators = {
  updatePhaseAction,
  firePhaseDirty,
  firePhaseDirtyUndo
}

export default withRouter(connect(mapStateToProps, actionCreators)(EditStageForm))
