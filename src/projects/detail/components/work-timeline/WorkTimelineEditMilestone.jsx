/**
 * Milestone view edit section
 */
import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'
import { Prompt, withRouter } from 'react-router-dom'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const Formsy = FormsyForm.Formsy
const TCFormFields = FormsyForm.Fields

import CloseIcon from  '../../../../assets/icons/x-mark-black.svg'
import TrashIcon from  '../../../../assets/icons/icon-trash-black.svg'
import BackIcon from  '../../../../assets/icons/arrows-16px-1_tail-left.svg'
import styles from './WorkTimelineEditMilestone.scss'
import { MILESTONE_TYPE, MILESTONE_STATUS } from '../../../../config/constants'
import {getMilestoneActualData} from '../../../../helpers/workstreams'
import SelectDropdown from '../../../../components/SelectDropdown/SelectDropdown'
import DeleteMilestone from './DeleteMilestone'


const moment = extendMoment(Moment)
const onLeaveUnSaveMessage = 'You haven’t saved your change. If you leave this page, your update will not be saved. Are you sure you want to leave?'
const milestoneTypes = MILESTONE_TYPE.map(ps => ({
  title: ps.name,
  value: ps.value,
}))
class WorkTimelineEditMilestone extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      canSubmit: false,
      showDeletePopup: false,
      canLeave: false,
    }

    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.getDashboardUrl = this.getDashboardUrl.bind(this)
    this.confirmedDeleteMilestone = this.confirmedDeleteMilestone.bind(this)
    this.onLeave = this.onLeave.bind(this)
    this.checkCanLeave = this.checkCanLeave.bind(this)
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onLeave)
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onLeave)
  }

  /**
    * Notify user if they navigate away while the form is modified.
    * @param {Object} e Event object
    *
    * @returns {String} notify message
   */
  onLeave(e = {}) {
    if (this.isChanged()) {
      return e.returnValue = onLeaveUnSaveMessage
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      isRequestMilestoneError,
      onBack
    } = nextProps

    // backto dashboard after create milestone successfully
    const prevIsCreatingMilestoneInfo = _.get(this.props, 'isCreatingMilestoneInfo')
    const nextIsCreatingMilestoneInfo = _.get(nextProps, 'isCreatingMilestoneInfo')
    if (prevIsCreatingMilestoneInfo === true && nextIsCreatingMilestoneInfo === false && !isRequestMilestoneError) {
      onBack()
    }
  }

  /**
   * Check if form is changed
   */
  isChanged() {
    // We check if this.refs.form exists because this may be called before the
    // first render, in which case it will be undefined.
    return (this.refs.form && this.refs.form.isChanged())
  }

  /**
   * Enable submit button
   */
  enableButton() {
    const model = this.refs.form.getModel()
    const { isNewMilestone } = this.props
    if (isNewMilestone) {
      this.setState( { canSubmit: ((
        model.name &&
        model.name.trim() &&
        moment(model.startDate).isValid() &&
        moment(model.endDate).isValid() &&
        moment(model.startDate) <= moment(model.endDate)
      ) ) })
    } else {
      this.setState( { canSubmit: ((
        model.name &&
        model.duration &&
        model.name.trim()
      ) ) })
    }
  }

  /**
   * Disable submit button
   */
  disableButton() {
    this.setState({ canSubmit: false })
  }

  /**
   * Get url of dashboard
   */
  getDashboardUrl() {
    const {
      match,
    } = this.props

    return `/projects/${match.params.projectId}`
  }

  /**
   * Submit form
   */
  onFormSubmit(model) {
    const { submitForm, timelines, isNewMilestone } = this.props
    const updatedStartDate = moment.utc(new Date(model.startDate))
    const updatedEndDate = moment.utc(new Date(model.endDate))
    const status = MILESTONE_STATUS.ACTIVE
    let updateParam

    if (isNewMilestone) {
      updateParam = _.assign({}, model, {
        startDate: updatedStartDate,
        endDate: updatedEndDate || '',
        status,
        duration: updatedEndDate.diff(updatedStartDate, 'days'),
        order: timelines[0].milestones.length,
        plannedText: 'empty', // this field is required in backend api but isn't supported by the form, so hardcode this field
        activeText: 'empty', // this field is required in backend api but isn't supported by the form, so hardcode this field
        completedText: 'empty', // this field is required in backend api but isn't supported by the form, so hardcode this field
        blockedText: 'empty', // this field is required in backend api but isn't supported by the form, so hardcode this field
      })
    } else {
      updateParam = _.cloneDeep(model)
    }
    if (!updateParam.description) {
      delete updateParam.description
    }
    submitForm(updateParam)
  }

  /**
   * Delete milestone
   */
  confirmedDeleteMilestone() {
    const {
      work,
      timelineId,
      milestone,
      deleteMilestone
    } = this.props

    deleteMilestone(work.id, timelineId, milestone.id)
  }

  /**
   * Check if can leave
   * @param {Function} action action to leave
   *
   * @returns {Bool} can leave
   */
  checkCanLeave(action) {
    if (!this.isChanged() || confirm(onLeaveUnSaveMessage)) {
      this.setState({ canLeave: true })
      if(action) {
        action()
      }
      return true
    }
    return false
  }

  render() {
    const {
      onBack,
      milestone,
      isUpdatingMilestoneInfo,
      isCreatingMilestoneInfo,
      isNewMilestone,
      isDeletingMilestoneInfo,
      timelines,
      work
    } = this.props
    const {showDeletePopup, canLeave} = this.state
    const onLeaveMessage = this.onLeave()

    const type = isNewMilestone ? MILESTONE_TYPE[0].value : milestone.type
    const milestones = timelines[0].milestones ? _.orderBy(timelines[0].milestones, o => moment(o.startDate), ['asc']) : []
    const { startDate, endDate, duration } = getMilestoneActualData(timelines[0], milestones, milestone, isNewMilestone)
    const description = (milestone && milestone.description) ? milestone.description : ''
    return (
      <div
        className={cn(
          styles['container'],
          {
            [styles['is-updating']]: isUpdatingMilestoneInfo || isCreatingMilestoneInfo || isDeletingMilestoneInfo || canLeave,
            [styles['new-milestone']]: isNewMilestone
          }
        )}
      >
        {/* Alert user if they try to navigate while unsaved changes are pending */}
        <Prompt
          when={!!onLeaveMessage && !canLeave}
          message={onLeaveUnSaveMessage}
        />
        <div className={styles['header']}>
          <div onClick={() => { this.checkCanLeave(onBack) }} className={styles['left-control']}>
            <i className={styles['icon']} title="back"><BackIcon /></i>
            <span className={styles['back-icon-text']}>Back</span>
          </div>
          <span className={styles['title']}>{isNewMilestone ? 'Add Milestone' : 'Edit Milestone'}</span>
          <div className={styles['right-control']}>
            {!isNewMilestone && (<i className={styles['icon']} title="delete" onClick={() => { this.setState({showDeletePopup: true}) }}><TrashIcon /></i>)}
            <i onClick={() => {
              if (!onLeaveMessage) {
                this.props.history.push(this.getDashboardUrl())
                onBack()
                // reset index of tabbarin WorkView
                work.selectedNav = 0
              } else if(this.checkCanLeave()) {
                setTimeout(() => {
                  this.props.history.push(this.getDashboardUrl())
                  onBack()
                  // reset index of tabbarin WorkView
                  work.selectedNav = 0
                })
              }
            }} className={styles['icon-close']}
            >
              <CloseIcon />
            </i>
          </div>
        </div>
        <div>
          <Formsy.Form
            ref="form"
            onInvalid={this.disableButton}
            onValid={this.enableButton}
            onValidSubmit={this.onFormSubmit}
          >
            <div className={styles['form-container']}>
              {isNewMilestone ? (<div className={styles['two-column']}>
                <TCFormFields.TextInput
                  wrapperClass={`${styles['input-row']}`}
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={startDate}
                />
                <TCFormFields.TextInput
                  wrapperClass={`${styles['input-row']}`}
                  label="End Date"
                  type="date"
                  name="endDate"
                  value={endDate}
                />
              </div>) : (<div className={styles['one-column']}>
                <TCFormFields.TextInput
                  wrapperClass={`${styles['input-row']}`}
                  label="Duration (days)"
                  type="number"
                  name="duration"
                  value={duration}
                  minValue={1}
                />
              </div>)}
              <div className={styles['one-column']}>
                <TCFormFields.TextInput
                  wrapperClass={`${styles['input-row']}`}
                  label="Name"
                  type="text"
                  name="name"
                  value={milestone.name}
                />
              </div>
              <div className={styles['one-column']}>
                <div className={`${styles['input-row']} ${styles['select-dropdown']}`}>
                  <label className="tc-label">Type</label>
                  <SelectDropdown
                    name="type"
                    value={type}
                    theme="default"
                    options={milestoneTypes}
                  />
                </div>
              </div>
              <div className={styles['one-column']}>
                <TCFormFields.Textarea
                  wrapperClass={`${styles['input-row']} ${styles['textarea-row']}`}
                  label="Description"
                  name="description"
                  rows={2}
                  value={description}
                />
              </div>
              <div className={styles['group-bottom']}>
                <button
                  onClick={onBack}
                  type="button"
                  className={'tc-btn tc-btn-default ' + styles['cancel-button']}
                ><strong>{'Cancel'}</strong></button>
                <button
                  className="tc-btn tc-btn-primary tc-btn-sm"
                  type="submit"
                  disabled={(!this.isChanged()) || !this.state.canSubmit}
                >{isNewMilestone ? 'Create Milestone' : 'Save Changes'}</button>
              </div>
            </div>
          </Formsy.Form>
        </div>
        {showDeletePopup && (
          <DeleteMilestone
            onCancelClick={() => { this.setState({showDeletePopup: false}) }}
            onDeleteClick={() => {
              this.confirmedDeleteMilestone()
              this.setState({showDeletePopup: false})
            }}
          />
        )}
      </div>
    )
  }
}

WorkTimelineEditMilestone.defaultProps = {
  onBack: () => {},
  submitForm: () => {},
  deleteMilestone: () => {},
  isNewMilestone: false
}

WorkTimelineEditMilestone.propTypes = {
  work: PT.shape({
    id: PT.number.isRequired,
  }),
  milestone: PT.shape({
    id: PT.number,
    startDate: PT.string,
    endDate: PT.string,
    name: PT.string,
  }),
  timelines: PT.arrayOf(PT.shape({
    id: PT.number.isRequired,
    startDate: PT.string,
    milestones: PT.arrayOf(PT.shape({
      id: PT.number,
      startDate: PT.string,
      endDate: PT.string,
      name: PT.string,
    })),
  })).isRequired,
  deleteMilestone: PT.func,
  isUpdatingMilestoneInfo: PT.bool,
  isCreatingMilestoneInfo: PT.bool,
  isDeletingMilestoneInfo: PT.bool,
  onBack: PT.func,
  submitForm: PT.func,
  isNewMilestone: PT.bool,
  isRequestMilestoneError: PT.bool,
  timelineId: PT.number.isRequired,
}

export default withRouter(WorkTimelineEditMilestone)
