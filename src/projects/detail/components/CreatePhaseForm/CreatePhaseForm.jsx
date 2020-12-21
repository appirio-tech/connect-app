/**
 * create phase and milestone
 */
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
import FormsySelect from '../../../../components/Select/FormsySelect'
import {  MILESTONE_TYPE, MILESTONE_TYPE_OPTIONS } from '../../../../config/constants'
import GenericMenu from '../../../../components/GenericMenu'
import TrashIcon from  '../../../../assets/icons/icon-trash.svg'
import  styles from './CreatePhaseForm.scss'

const Formsy = FormsyForm.Formsy
const TCFormFields = FormsyForm.Fields

const phaseOptions = _.map(MILESTONE_TYPE_OPTIONS, o => ({label: o.title, value: o.value}))

class CreatePhaseForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      publishClicked: false,
      isAddButtonClicked: false,
      canSubmit: false,
      milestones: [{
        type: MILESTONE_TYPE.REPORTING,
        title: 'Reporting',
        startDate: moment.utc().format('YYYY-MM-DD'),
        endDate: moment.utc().add(3, 'days').format('YYYY-MM-DD')
      }]
    }

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
    this.setState({
      publishClicked: false,
      isAddButtonClicked: false,
      milestones: [{
        type: MILESTONE_TYPE.REPORTING,
        title: 'Reporting',
        startDate: moment.utc().format('YYYY-MM-DD'),
        endDate: moment.utc().add(3, 'days').format('YYYY-MM-DD')
      }]
    })
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
    const { publishClicked } = this.state

    const phaseData = {
      title: model.title,
      startDate: moment(model.startDate),
      endDate: moment(model.endDate),
    }

    const milestones = []
    _.forEach(_.keys(_.omit(model, ['title', 'startDate', 'endDate'])), (k) => {
      const arrs =  k.match(/(\w+)_(\d+)/)
      const arrIndex = arrs[2]
      const objKey = arrs[1] === 'title'? 'name': arrs[1]
      if (!milestones[arrIndex]) {
        milestones[arrIndex] = {}
      }
      milestones[arrIndex][objKey] = model[k]
    })

    _.forEach(milestones, (m, index) => {
      m.status = 'reviewed'
      m.order = index + 1
      // TODO  add mock data
      m.duration = 1
      m.hidden =false
      m.completedText = 'completed text'
      m.activeText = 'active text'
      m.description = 'description'
      m.plannedText ='planned text'
      m.details = {}
      m.blockedText = 'blocked text'
    })

    if (publishClicked) {
      onSubmit('active', phaseData, milestones)
    } else {
      onSubmit('draft', phaseData, milestones)
    }
    this.resetStatus()
  }
  /**
   * Handles the change event of the form.
   *
   * @param change changed form model in flattened form
   * @param isChanged flag that indicates if form actually changed from initial model values
   */
  handleChange(change) {
    const {
      milestones
    } = this.state


    // omit phase fields
    _.forEach(_.keys(_.omit(change, ['title', 'startDate', 'endDate'])), (k) => {
      const arrs =  k.match(/(\w+)_(\d+)/)
      const arrIndex = arrs[2]
      const objKey = arrs[1]
      if(change[k] && change[k] !== milestones[arrIndex][objKey]) {
        // set default title with option type
        if (objKey === 'type' && !milestones[arrIndex]['type']) {
          milestones[arrIndex]['title'] = this.getOptionType(change[k])
        }
        milestones[arrIndex][objKey] = change[k]
      }
    })


    this.setState({milestones})
  }

  getOptionType(val) {
    return _.find(phaseOptions, (v) => v.value === val).label
  }

  onDeleteMilestoneClick(index) {
    const {
      milestones
    } = this.state
    milestones.splice(index, 1)
    this.setState({
      milestones
    })
  }

  onAddMilestoneClick() {
    const {
      milestones
    } = this.state

    const defaultData = {
      startDate: moment(_.last(milestones).endDate).format('YYYY-MM-DD'),
      endDate: moment(_.last(milestones).endDate).add(3, 'days').format('YYYY-MM-DD')
    }
    milestones.push(defaultData)

    this.setState({
      milestones
    })
  }

  renderMilestones() {
    const {
      milestones
    } = this.state

    const ms = _.map(milestones, (m, index) => {
      return (
        <div styleName="milestone-item">
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
              validationError={'Please, enter title'}
              label="title"
              type="text"
              name={`title_${index}`}
              value={milestones[index].title}
            />
          </div>
          <div styleName="label-layer">
            <TCFormFields.TextInput
              wrapperClass={`${styles['input-row']}`}
              validations={{isRequired: true}}
              validationError={'Please, enter start date'}
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
              validations={{isRequired: true}}
              validationError={'Please, enter end date'}
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
  renderAddingForm() {
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
            <div styleName="label-layer">
              <TCFormFields.TextInput
                wrapperClass={`${styles['input-row']}`}
                validations={{isRequired: true}}
                validationError={'Please, enter start date'}
                required
                label="Start Date"
                type="date"
                name="startDate"
                value={moment.utc().format('YYYY-MM-DD')}
              />
              <TCFormFields.TextInput
                wrapperClass={`${styles['input-row']}`}
                validations={{isRequired: true}}
                validationError={'Please, enter end date'}
                required
                label="End Date"
                type="date"
                name="endDate"
                value={moment.utc().add(3, 'days').format('YYYY-MM-DD')}
              />
            </div>
            {this.renderTab()}
            {this.renderMilestones()}
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

  render() {
    const { isAddButtonClicked } = this.state

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
            <div styleName="label-layer">
              <TCFormFields.TextInput
                wrapperClass={`${styles['input-row']}`}
                validations={{isRequired: true}}
                validationError={'Please, enter start date'}
                required
                label="Start Date"
                type="date"
                name="startDate"
                value={moment.utc().format('YYYY-MM-DD')}
              />
              <TCFormFields.TextInput
                wrapperClass={`${styles['input-row']}`}
                validations={{isRequired: true}}
                validationError={'Please, enter end date'}
                required
                label="End Date"
                type="date"
                name="endDate"
                value={moment.utc().add(3, 'days').format('YYYY-MM-DD')}
              />
            </div>
            {this.renderTab()}
            {this.renderMilestones()}
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
}

export default CreatePhaseForm
