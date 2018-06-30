import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'

import styles from './EditStageForm.scss'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
const TCFormFields = FormsyForm.Fields
// import enhanceDropdown from 'appirio-tech-react-components/components/Dropdown/enhanceDropdown'
import { updatePhase as updatePhaseAction, syncPhases as syncPhasesAction } from '../../../actions/project'
import LoadingIndicator from '../../../../components/LoadingIndicator/LoadingIndicator'
import SelectDropdown from '../../../../components/SelectDropdown/SelectDropdown'
import { PHASE_STATUS_COMPLETED, PHASE_STATUS, PHASE_STATUS_ACTIVE } from '../../../../config/constants'


const phaseStatuses = PHASE_STATUS.map(ps => ({ title: ps.name, value: ps.value }))

class EditStageForm extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      isUpdating: false,
      isEdittable: _.get(props, 'phase.status') !== PHASE_STATUS_COMPLETED,
      disableActiveStatusFields: _.get(props, 'phase.status') !== PHASE_STATUS_ACTIVE,
      showPhaseOverlapWarning: false
    }
    this.submitValue = this.submitValue.bind(this)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isUpdating: nextProps.isUpdating,
      isEdittable: nextProps.phase.status !== PHASE_STATUS_COMPLETED,
      disableActiveStatusFields: nextProps.phase.status !== PHASE_STATUS_ACTIVE
    })
  }

  submitValue(model) {
    const { phase, phaseIndex, updatePhaseAction } = this.props

    const updatedStartDate = moment(new Date(model.startDate))
    const endDate = moment(updatedStartDate).add(model.duration - 1, 'days').utc()
    const updateParam = _.assign({}, model, {
      startDate: updatedStartDate.utc(),
      endDate: endDate || ''
    })
    this.setState({isUpdating: true})
    updatePhaseAction(phase.projectId, phase.id, updateParam, phaseIndex)
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
    return (this.refs.form && this.refs.form.isChanged()) || this.state.isFeaturesDirty
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
    // if start date's day or duration is updated for a phase, we need to update other phases dates accordingly
    const phaseDay = moment(new Date(phase.startDate)).format('DD')
    const changedDay = moment(new Date(change.startDate)).format('DD')
    if (phaseDay !== changedDay || phase.duration !== change.duration) {
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
      disableActiveStatusFields: change.status !== PHASE_STATUS_ACTIVE,
      showPhaseOverlapWarning
    })
    if (this.isChanged()) {
      // TODO fire dirty event for phase
      // this.props.fireProjectDirty(unflatten(change))
    } else {
      // this.props.fireProjectDirtyUndo()
    }
  }

  checkOverlappingPhases(phases, refPhase, refPhaseIndex, updatedPhase) {
    // if startDate or duration is not set in the current update, we don't need to do anything
    if (!updatedPhase.startDate || !updatedPhase.duration) return false

    //Possible mutations
    //!date,!duration //both changed
    //!date,duration //date changed
    //date,!duration //duration changed
    const phasesToBeUpdated = []
    var overLapping = false
    for(let i =0; i < phases.length; i++) {
      if(i == 0) {//first phase
        if(i == refPhaseIndex) {//passing updatedPhase in this case
          overLapping = this.isPhaseOverlapping(null, updatedPhase, phases[i+1])
        } else {//checking if next phase is currently updated phase, for dynamically removing warning
          let next = phases[i+1]
          if(i+1 == refPhaseIndex)
            next = updatedPhase
          overLapping = this.isPhaseOverlapping(null, phases[i], next)
        }
      } else if(i == phases.length - 1) { //last phase
        if(i == refPhaseIndex) {//passing updatedPhase in this case
          overLapping = this.isPhaseOverlapping(phases[i-1], updatedPhase, null)
        } else {//checking if next phase is currently updated phase, for dynamically removing warning
          let prev = phases[i-1]
          if(i-1 == refPhaseIndex)
            prev = updatedPhase
          overLapping = this.isPhaseOverlapping(prev, phases[i], null)
        }
      }  else {//middle phases
        if(i == refPhaseIndex) {//passing updatedPhase in this case
          overLapping = this.isPhaseOverlapping(phases[i-1], updatedPhase, phases[i+1])
        } else {
          let prev = phases[i-1]
          let next = phases[i+1]
          if(i == refPhaseIndex + 1) //for dynamically removing warning
            prev = updatedPhase
          else if (i == refPhaseIndex - 1) //for dynamically removing warning
            next = updatedPhase
          overLapping = this.isPhaseOverlapping(prev, phases[i], next)
        }
      }
      //pushing the phase if its overlapping with any
      if(overLapping) {
        phasesToBeUpdated.push({ id: phases[i].id, startDate: moment(new Date(phases[i].startDate)).utc(), name: phases[i].name})
      }
    }
    return phasesToBeUpdated
  }

  isPhaseOverlapping(prevPhase, currentPhase, nextPhase) {
    const prevPhaseEndDate = prevPhase ? moment(new Date(prevPhase.startDate)).add(prevPhase.duration - 1, 'days') : null
    const currentStartDate = moment(new Date(currentPhase.startDate))
    const currentEndDate = moment(new Date(currentPhase.startDate)).add(currentPhase.duration - 1, 'days')
    const nextPhaseStartDate = nextPhase ? moment(new Date(nextPhase.startDate)) : null
    //debugger
    //check startDate of currentPhase with previous's endDate
    if(prevPhase && !(currentStartDate > prevPhaseEndDate))
      return true
    //check endDate of currentPhase with next's startDate
    if(nextPhase && !(currentEndDate < nextPhaseStartDate))
      return true
    return false
  }

  syncPhases(phases, refPhase, refPhaseIndex, updatedPhase) {
    // if startDate or duration is not set in the current update, we don't need to do anything
    if (!updatedPhase.startDate || !updatedPhase.duration) return
    const updatedStartDate = moment(new Date(updatedPhase.startDate))
    // if startDate was not set before the current update, we use updated startDate as previous startDate
    let refPhaseStartDate = refPhase.startDate ? moment(new Date(refPhase.startDate)) : moment(updatedStartDate)
    // if endDate was not set before the current update, we use updated endDate as previous endDate
    let refPhaseEndDate = refPhase.endDate ? moment(new Date(refPhase.endDate)) : moment(new Date(updatedPhase.startDate)).add(updatedPhase.duration - 1, 'days')
    // delta in startDate, it would be 0 when startDate was not set before the current update
    const deltaStart = updatedStartDate.diff(refPhaseStartDate, 'days')
    // delta in duration, it would be 0 when duration was not set before the current update
    const deltaDuration = updatedPhase.duration - (refPhase.duration ? refPhase.duration : updatedPhase.duration)
    const phasesToBeUpdated = []
    // handles phases before the refPhase
    if (deltaStart <= 0) {
      let delta = deltaStart
      for (let i = refPhaseIndex - 1; i >= 0 ; i--) {
        const phase = phases[i]
        if (!phase.startDate || !phase.duration) break
        const startDate = moment(new Date(phase.startDate))
        const endDate = moment(new Date(phase.startDate)).add(phase.duration - 1, 'days')
        const bufferDays = refPhaseStartDate.diff(endDate, 'days') - 1
        const offset = Math.abs(delta) - bufferDays
        if (offset > 0) { // change in refPhase is has decreased start date
          startDate.subtract(offset, 'days')
          phasesToBeUpdated.push({ id: phase.id, startDate: startDate.utc()})
        } else { // change in refPhase is has increased start date
          // break the loop, as we won't have any cascading effect now on
          break
        }
        // updates refPhaseStartDate to be start date of the current phase
        refPhaseStartDate = moment(new Date(phase.startDate))
        delta = Math.abs(offset)
      }
    }
  
    // handles phases after the refPhase
    if (deltaStart + deltaDuration >= 0) {
      let delta = deltaStart + deltaDuration
      for (let i = refPhaseIndex + 1; i < phases.length ; i++) {
        const phase = phases[i]
        if (!phase.startDate || !phase.duration) break
        const startDate = moment(new Date(phase.startDate))
        const endDate = moment(new Date(phase.startDate)).add(phase.duration - 1, 'days')
        const bufferDays = startDate.diff(refPhaseEndDate, 'days') - 1
        const offset = delta - bufferDays
        // change in refPhase is has caused end date of the refPhase to be pushed forward
        if (offset > 0) {
          startDate.add(offset, 'days')
          phasesToBeUpdated.push({ id: phase.id, startDate: startDate.utc()})
        } else { // change in refPhase is has not caused the end date of the refPhase to be pushed forward
          // break the loop, as we won't have any cascading effect now on
          break
        }
        // updates refPhaseEndDate to be end date of the current phase
        refPhaseEndDate = endDate//moment(startDate).add(phase.duration, 'days')
        delta = offset
      }
    }
    return phasesToBeUpdated
  }

  render() {
    const { phase, cancel, isUpdating } = this.props
    const { isEdittable, showPhaseOverlapWarning } = this.state
    let startDate = phase.startDate ? new Date(phase.startDate) : new Date()
    startDate = moment(startDate).format('YYYY-MM-DD')
    return (
      <div styleName="container">
        {this.state.isUpdating && (<LoadingIndicator />)}
        {!this.state.isUpdating && (<div>
          <Formsy.Form
            ref="form"
            disabled={!isEdittable}
            onInvalid={this.disableButton}
            onValid={this.enableButton}
            onValidSubmit={this.submitValue}
            onChange={ this.handleChange }
          >
            <div styleName="form">
              { showPhaseOverlapWarning && <div className="error-message">
                Warning: You are about to manually change the start/end date of this phase, Please ensure the start and end dates of all subsequent phases (where applicable) are updated in line with this change.
              </div> }
              <div styleName="label-layer">
                <TCFormFields.TextInput wrapperClass={`${styles['input-row']}`} label="Start Date" type="date" name="startDate" value={startDate} />
                <TCFormFields.TextInput wrapperClass={`${styles['input-row']}`} label="Duration" type="number" name="duration" value={phase.duration} minValue={1}/>
              </div>
              <div styleName="label-layer">
                <TCFormFields.TextInput wrapperClass={`${styles['input-row']}`} label="Spent" type="number" name="spentBudget" value={phase.spentBudget} disabled={this.state.disableActiveStatusFields} minValue={0}/>
                <TCFormFields.TextInput wrapperClass={`${styles['input-row']}`} label="Budget" type="number" name="budget" value={phase.budget} minValue={0}/>
              </div>
              <div styleName="label-layer">
                <div styleName="input-row">
                  <label className="tc-label">Status</label>
                  <SelectDropdown name="status" value={phase.status} theme="default" options={phaseStatuses} />
                </div>
                <TCFormFields.TextInput wrapperClass={`${styles['input-row']}`} label="Progress" type="number" name="progress" value={phase.progress} disabled={this.state.disableActiveStatusFields} minValue={0} />
              </div>
              <div styleName="group-bottom">
                <button onClick={cancel} type="button" className="tc-btn tc-btn-default"><strong>{'Cancel'}</strong></button>
                <button className="tc-btn tc-btn-primary tc-btn-sm"
                  type="submit" disabled={(!this.isChanged() || isUpdating) || !this.state.canSubmit}
                >Update Phase</button>
              </div>
            </div>
          </Formsy.Form>
        </div>)}
      </div>
    )
  }
}

EditStageForm.defaultProps = {
  cancel: () => {}
}

EditStageForm.propTypes = {
  cancel: PT.func,
  phase: PT.object,
  phaseIndex: PT.number
}

const mapStateToProps = ({projectState}) => ({
  isUpdating: projectState.processing,
  phases: projectState.phases
})

const actionCreators = {updatePhaseAction, syncPhasesAction}

export default withRouter(connect(mapStateToProps, actionCreators)(EditStageForm))
