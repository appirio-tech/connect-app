/**
 * create phase and milestone
 */
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
import FormsySelect from '../../../../components/Select/FormsySelect'
import {  MILESTONE_TYPE, MILESTONE_TYPE_OPTIONS, MILESTONE_STATUS, MILESTONE_DEFAULT_VALUES } from '../../../../config/constants'
import GenericMenu from '../../../../components/GenericMenu'
import TrashIcon from  '../../../../assets/icons/icon-trash.svg'
import  styles from './CreatePhaseForm.scss'
import { isValidStartEndDates } from '../../../../helpers/utils'

const Formsy = FormsyForm.Formsy
const TCFormFields = FormsyForm.Fields

const phaseOptions = _.map(MILESTONE_TYPE_OPTIONS, o => ({label: o.title, value: o.value}))

/**
 * Get milestone data from the formzy model by index
 *
 * @param {Object} model formzy flat model
 * @param {Number} index milestone index
 */
const getMilestoneModelByIndex = (model, index) => {
  let milestoneModel

  // omit phase fields
  _.forEach(_.keys(_.omit(model, ['title', 'description', 'startDate', 'endDate'])), (key) => {
    const keyMatches = key.match(/(\w+)_(\d+)/)

    if (keyMatches.length !== 3) {
      return
    }

    const arrIndex = Number(keyMatches[2])
    const objKey = keyMatches[1]

    if (arrIndex === index) {
      if (!milestoneModel) {
        milestoneModel = {}
      }

      milestoneModel[objKey] = model[key]
    }
  })

  return milestoneModel
}

const defaultState = {
  publishClicked: false,
  isAddButtonClicked: false,
  canSubmit: false,
  milestones: [{
    pseudoId: _.uniqueId('milestone_'), // we need this to use for unique React `key` (using `index` might lead to issues)
    type: MILESTONE_TYPE.REPORTING,
    name: 'Reporting',
    startDate: moment.utc().format('YYYY-MM-DD'),
    endDate: moment.utc().add(3, 'days').format('YYYY-MM-DD')
  }]
}

class CreatePhaseForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = _.cloneDeep(defaultState)

    this.onAddClick = this.onAddClick.bind(this)
    this.onCancelClick = this.onCancelClick.bind(this)
    this.onPublishClick = this.onPublishClick.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.onDeleteMilestoneClick = this.onDeleteMilestoneClick.bind(this)
    this.onAddMilestoneClick = this.onAddMilestoneClick.bind(this)
  }

  onPublishClick() {
    this.setState({
      publishClicked: true,
    })
  }

  resetStatus() {
    this.setState(_.cloneDeep(defaultState))
  }

  onCancelClick() {
    this.resetStatus()
  }

  onAddClick() {
    this.setState( {
      isAddButtonClicked: true
    })
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

  onFormSubmit(model) {
    const {onSubmit} = this.props
    const { publishClicked, milestones } = this.state

    const phaseData = {
      title: model.title,
      description: model.description,
      startDate: moment(model.startDate),
      endDate: moment(model.endDate),
    }

    const apiMilestones = milestones.map((milestone, index) => ({
      // default values
      ...MILESTONE_DEFAULT_VALUES[milestone.type],
      ..._.omit(milestone, 'pseudoId'),
      startDate: model.startDate,
      endDate: model.endDate,

      // values from the form
      ...getMilestoneModelByIndex(model, index),

      // auto-generated values
      order: index + 1,
      duration: moment(milestone.endDate).diff(moment(milestone.startDate), 'days') + 1
    }))

    if (publishClicked) {
      apiMilestones[0].status = MILESTONE_STATUS.ACTIVE
      apiMilestones[0].actualStartDate = moment().toISOString()
      onSubmit('active', phaseData, apiMilestones)
    } else {
      onSubmit('draft', phaseData, apiMilestones)
    }
    this.resetStatus()
  }

  /**
   * Handles the change event of the form.
   *
   * @param change changed form model in flattened form
   */
  handleChange(change) {
    const { projectVersion } = this.props
    // DO NOT update milestones state if project version is 4
    if (projectVersion === 4) return
    const { milestones } = this.state

    // update all milestones in state from the Formzy model
    const newMilestones = milestones.map((milestone, index) => {

      const milestoneModel = getMilestoneModelByIndex(change, index)

      const updatedMilestone = {
        ...milestone,  // keep all additional values we might keep in state
        ...milestoneModel
      }

      // if milestone has empty `name` then set it equal to the type textual value
      if (milestoneModel.type && !milestoneModel.name) {
        updatedMilestone.name = this.getOptionType(milestoneModel.type)
      }

      return updatedMilestone
    })

    this.setState({ milestones: newMilestones })
  }

  getOptionType(val) {
    return _.find(phaseOptions, (v) => v.value === val).label
  }

  onDeleteMilestoneClick(index) {
    const {
      milestones
    } = this.state

    this.setState({
      // delete without mutation
      milestones: _.filter(milestones, (m, i) => i !== index)
    })
  }

  onAddMilestoneClick() {
    const {
      milestones
    } = this.state

    const newMilestone = {
      pseudoId: _.uniqueId('milestone_'), // we need this to use for unique React `key` (using `index` might lead to issues)
      name: '',
      startDate: moment(_.last(milestones).endDate).format('YYYY-MM-DD'),
      endDate: moment(_.last(milestones).endDate).add(3, 'days').format('YYYY-MM-DD')
    }

    this.setState({
      // add without mutation
      milestones: [
        ...milestones,
        newMilestone
      ]
    })
  }

  renderMilestones() {
    const {
      milestones
    } = this.state
    
    const ms = _.map(milestones, (m, index) => {
      return (
        <div styleName="milestone-item" key={m.pseudoId}>
          <div styleName="title-label-layer">
            <div styleName="input-row">
              <label className="tc-label">Type</label>
              <FormsySelect
                name={`type_${index}`}
                value={milestones[index].type}
                isDisabled={index === 0}
                options={phaseOptions}
                // onChange={this.onCountryChange}
                placeholder="Select Type"
                showDropdownIndicator
                setValueOnly
                // onBlur={this.hideCountrySelectAlert}
                required
                validationError="Please select Type"
              />
            </div>
          </div>
          <div styleName="label-layer">
            <TCFormFields.TextInput
              wrapperClass={`${styles['input-row']}`}
              validationError={'Please, enter name'}
              label="Name"
              type="text"
              name={`name_${index}`}
              value={milestones[index].name}
            />
          </div>
          <div styleName="label-layer">
            <TCFormFields.TextInput
              wrapperClass={`${styles['input-row']}`}
              validations={{
                isRequired: true,
                isValidStartEndDates: (values) => isValidStartEndDates(getMilestoneModelByIndex(values, index))
              }}
              validationError={'Please, enter start date'}
              validationErrors={{
                isValidStartEndDates: 'Start date cannot be after end date'
              }}
              required
              label="Start Date"
              type="date"
              name={`startDate_${index}`}
              value={milestones[index].startDate}
            />
          </div>
          <div styleName="label-layer">
            <TCFormFields.TextInput
              wrapperClass={`${styles['input-row']}`}
              validations={{
                isRequired: true,
                isValidStartEndDates: (values) => isValidStartEndDates(getMilestoneModelByIndex(values, index))
              }}
              validationError={'Please, enter end date'}
              validationErrors={{
                isValidStartEndDates: 'End date cannot be before start date'
              }}
              required
              label="End Date"
              type="date"
              name={`endDate_${index}`}
              value={milestones[index].endDate}
            />
          </div>
          {index !== 0 && (
            <i className="icon-trash" onClick={() => this.onDeleteMilestoneClick(index)} title="trash"><TrashIcon /></i>
          )}
        </div>
      )
    })

    return (
      <div styleName="add-milestone-form">
        {ms}
        <div styleName="add-milestone-wrapper">
          <button
            type="button"
            onClick={this.onAddMilestoneClick}
            className="tc-btn tc-btn-primary tc-btn-sm"
          >Add Milestone</button>
        </div>
      </div>
    )
  }

  renderTab() {
    const tabs = [
      {
        onClick: () => {},
        label: 'Timeline',
        isActive: true,
        hasNotifications: false,
      }]
    return (
      <div styleName="tab-container">
        <GenericMenu navLinks={tabs} />
      </div>
    )
  }

  render() {
    const { isAddButtonClicked } = this.state
    const { projectVersion } = this.props

    // const searchParams = new URLSearchParams(window.location.search)
    // const isBetaMode = searchParams.get('beta') === 'true'

    if (!isAddButtonClicked) {
      return (
        <div styleName="add-button-container">
          <button
            onClick={this.onAddClick}
            className="tc-btn tc-btn-primary tc-btn-sm action-btn"
          >Add New Phase</button>
        </div>
      )
    }

    return (
      <div styleName="add-phase-form">
        <Formsy.Form
          ref="form"
          onInvalid={this.disableButton}
          onValid={this.enableButton}
          onValidSubmit={this.onFormSubmit}
          onChange={ this.handleChange }
        >
          <div styleName="form">
            <div styleName="title-label-layer">
              <TCFormFields.TextInput
                wrapperClass={`${styles['input-row']}`}
                validations={{isRequired: true}}
                validationError={'Please, enter title'}
                required
                label="Title"
                type="text"
                name="title"
                value={''}
                maxLength={48}
              />
            </div>
            <div styleName="description-label-layer">
              <TCFormFields.Textarea
                autoResize
                wrapperClass={`${styles['input-row']}`}
                label="Description"
                name="description"
                value={''}
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
                value={moment.utc().format('YYYY-MM-DD')}
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
                value={moment.utc().add(3, 'days').format('YYYY-MM-DD')}
              />
            </div>
            { projectVersion !== 4 && this.renderTab()}
            { projectVersion !== 4 && this.renderMilestones()}
            <div styleName="group-bottom">
              <button onClick={this.onCancelClick} type="button" className="tc-btn tc-btn-default"><strong>{'Cancel'}</strong></button>
              <button className="tc-btn tc-btn-primary tc-btn-sm"
                type="submit" disabled={!this.isChanged() || !this.state.canSubmit}
              >Save Draft</button>
              <button
                onClick={this.onPublishClick}
                className="tc-btn tc-btn-primary tc-btn-sm"
                type="submit" disabled={!this.isChanged() || !this.state.canSubmit}
              >Publish</button>
            </div>
          </div>
        </Formsy.Form>
      </div>
    )
  }
}

CreatePhaseForm.propTypes = {
  onSubmit: PT.func.isRequired,
  projectVersion: PT.number,
}

export default CreatePhaseForm
