/**
 * Work view edit section
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
import styles from './WorkViewEdit.scss'
import { PHASE_STATUS_DRAFT, PHASE_STATUS } from '../../../../config/constants'
import {getWorkActualData} from '../../../../helpers/workstreams'
import SelectDropdown from '../../../../components/SelectDropdown/SelectDropdown'
import DeleteWork from './DeleteWork'


const moment = extendMoment(Moment)
const onLeaveUnSaveMessage = 'You haven’t saved your change. If you leave this page, your update will not be saved. Are you sure you want to leave?'
const phaseStatuses = PHASE_STATUS.map(ps => ({
  title: ps.name,
  value: ps.value,
}))
class WorkViewEdit extends React.Component {
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
    this.deleteWork = this.deleteWork.bind(this)
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
      isRequestWorkError,
      onClose
    } = nextProps

    // backto dashboard after create work successfully
    const prevIsCreatingWorkInfo = _.get(this.props, 'isCreatingWorkInfo')
    const nextIsCreatingWorkInfo = _.get(nextProps, 'isCreatingWorkInfo')
    if (prevIsCreatingWorkInfo === true && nextIsCreatingWorkInfo === false && !isRequestWorkError) {
      onClose()
    }

    // backto dashboard after delete work successfully
    const prevIsDeletingWorkInfo = _.get(this.props, 'isDeletingWorkInfo')
    const nextIsDeletingWorkInfo = _.get(nextProps, 'isDeletingWorkInfo')
    if (prevIsDeletingWorkInfo === true && nextIsDeletingWorkInfo === false && !isRequestWorkError) {
      this.setState({ canLeave: true })
      setTimeout(() => {
        this.props.history.push(this.getDashboardUrl())
      })
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
    this.setState( { canSubmit: ((
      parseInt(model.duration) >= 1 &&
      parseInt(model.spentBudget) >= 0 &&
      parseInt(model.budget) >= 0 &&
      parseInt(model.progress) >= 0 &&
      model.startDate
    ) ) })
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
    const { submitForm } = this.props
    const updatedStartDate = moment.utc(new Date(model.startDate))
    const duration = model.duration ? model.duration : 1
    const endDate = moment.utc(updatedStartDate).add(duration, 'days')
    const status = model.status ? model.status : PHASE_STATUS[0].value
    const updateParam = _.assign({}, model, {
      startDate: updatedStartDate,
      endDate: endDate || '',
      duration,
      status
    })

    submitForm(updateParam)
  }

  /**
   * Delete work
   */
  deleteWork() {
    const { match: { params: { projectId, workstreamId, workId } }, deleteWork } = this.props
    deleteWork(projectId, workstreamId, workId)
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
      action()
      return true
    }
    return false
  }

  render() {
    const {
      onBack,
      work,
      isUpdatingWorkInfo,
      isCreatingWorkInfo,
      isNewWork,
      isDeletingWorkInfo,
      onClose,
    } = this.props

    const {showDeletePopup, canLeave} = this.state
    const onLeaveMessage = this.onLeave()

    let startDate = work.startDate ? new Date(work.startDate) : new Date()
    startDate = moment.utc(startDate).format('YYYY-MM-DD')
    if (isNewWork) {
      startDate = ''
    }
    const status = isNewWork ? PHASE_STATUS[0].value : work.status
    const { progress, duration, spentBudget, budget } = getWorkActualData(work, isNewWork)

    return (
      <div
        className={cn(
          styles['container'],
          {
            [styles['is-updating']]: isUpdatingWorkInfo || isCreatingWorkInfo || isDeletingWorkInfo || canLeave,
            [styles['new-work']]: isNewWork
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
            {!isNewWork && (<i className={styles['icon']} title="back"><BackIcon /></i>)}
            {!isNewWork && (<span className={styles['back-icon-text']}>Back</span>)}
          </div>
          <span className={styles['title']}>{isNewWork ? 'Add Work' : 'Edit Work'}</span>
          <div className={styles['right-control']}>
            {!isNewWork && (<i className={styles['icon']} title="delete" onClick={() => { this.setState({showDeletePopup: true}) }}><TrashIcon /></i>)}
            <i onClick={() => {
              if (isNewWork) {
                this.checkCanLeave(onClose)
              } else if (!onLeaveMessage) {
                this.props.history.push(this.getDashboardUrl())
              } else {
                if(this.checkCanLeave(onClose)) {
                  setTimeout(() => {
                    this.props.history.push(this.getDashboardUrl())
                  })
                }
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
              <div className={styles['one-column']}>
                <TCFormFields.TextInput
                  wrapperClass={`${styles['input-row']}`}
                  label="Title"
                  type="text"
                  name="name"
                  value={work.name}
                />
              </div>
              <div className={styles['one-column']}>
                <TCFormFields.TextInput
                  wrapperClass={`${styles['input-row']}`}
                  label="Description"
                  type="text"
                  name="description"
                  value={work.description}
                />
              </div>
              <div className={styles['two-column']}>
                <TCFormFields.TextInput
                  wrapperClass={`${styles['input-row']}`}
                  label="Start Date"
                  type="date"
                  name="startDate"
                  value={startDate}
                />
                <TCFormFields.TextInput
                  wrapperClass={`${styles['input-row']}`}
                  label="Duration (days)"
                  type="number"
                  name="duration"
                  value={duration}
                  minValue={1}
                />
              </div>
              <div className={styles['two-column']}>
                <TCFormFields.TextInput
                  wrapperClass={`${styles['input-row']}`}
                  label="Paid to date (US$)"
                  type="number"
                  name="spentBudget"
                  value={spentBudget}
                  minValue={0}
                />
                <TCFormFields.TextInput
                  wrapperClass={`${styles['input-row']}`}
                  label="Price (US$)"
                  type="number"
                  name="budget"
                  value={budget}
                  minValue={0}
                />
              </div>
              <div className={styles['two-column']}>
                <div className={styles['input-row']}>
                  <label className="tc-label">Status</label>
                  <SelectDropdown
                    name="status"
                    value={status}
                    theme="default"
                    options={phaseStatuses}
                  />
                </div>

                <TCFormFields.TextInput
                  wrapperClass={`${styles['input-row']}`}
                  label="Progress (%)"
                  type="number"
                  name="progress"
                  value={work.status === PHASE_STATUS_DRAFT ? 0 : progress}
                  minValue={0}
                />
              </div>
              <div className={styles['group-bottom']}>
                {!isNewWork && (
                  <button
                    onClick={() => {
                      this.checkCanLeave(onBack)
                    }}
                    type="button"
                    className={'tc-btn tc-btn-default ' + styles['cancel-button']}
                  ><strong>{'Cancel'}</strong></button>)}
                <button
                  className="tc-btn tc-btn-primary tc-btn-sm"
                  type="submit"
                  disabled={(!this.isChanged()) || !this.state.canSubmit}
                >{isNewWork ? 'Create Work' : 'Save Changes'}</button>
              </div>
            </div>
          </Formsy.Form>
        </div>
        {showDeletePopup && (
          <DeleteWork
            onCancelClick={() => { this.setState({showDeletePopup: false}) }}
            onDeleteClick={() => {
              this.deleteWork()
              this.setState({showDeletePopup: false})
            }}
          />
        )}
      </div>
    )
  }
}

WorkViewEdit.defaultProps = {
  onBack: () => {},
  onClose: () => {},
  submitForm: () => {},
  isNewWork: false
}

WorkViewEdit.propTypes = {
  work: PT.shape({
    id: PT.number,
    name: PT.string,
    status: PT.string,
    description: PT.string,
    spentBudget: PT.number,
    budget: PT.number,
  }).isRequired,
  deleteWork: PT.func.isRequired,
  isUpdatingWorkInfo: PT.bool.isRequired,
  isCreatingWorkInfo: PT.bool.isRequired,
  isDeletingWorkInfo: PT.bool.isRequired,
  onBack: PT.func.isRequired,
  onClose: PT.func.isRequired,
  submitForm: PT.func,
  isNewWork: PT.bool,
  isRequestWorkError: PT.bool,
}

export default withRouter(WorkViewEdit)
