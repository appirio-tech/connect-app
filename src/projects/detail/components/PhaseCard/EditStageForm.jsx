import React from 'react'
import PT from 'prop-types'

import './EditStageForm.scss'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updatePhase } from '../../../actions/project'

class EditStageForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      duration: '',
      startDate: '',
      spent: '',
      budget: ''
    }
    this.submitValue = this.submitValue.bind(this)
    this.onDurationChange = this.onDurationChange.bind(this)
    this.onStartDateChange = this.onStartDateChange.bind(this)
    this.onSpentChange = this.onSpentChange.bind(this)
    this.onBudgetChange = this.onBudgetChange.bind(this)
  }

  submitValue() {
    const props = this.props
    const phase = props.phase
    phase.startDate = this.state.startDate
    phase.budget = Number(this.state.budget)
    props.updatePhase(props.phase, props.phaseIndex)
    props.update()
  }

  onDurationChange (event) {
    event.stopPropagation()
    this.setState({duration: event.target.value})
  }

  onStartDateChange (event) {
    event.stopPropagation()
    this.setState({startDate: event.target.value})
  }

  onSpentChange(event) {
    event.stopPropagation()
    this.setState({spent: event.target.value})
  }

  onBudgetChange(event) {
    event.stopPropagation()
    this.setState({budget: event.target.value})
  }

  render() {
    const props = this.props
    const opts = {}
    if (!this.state.duration || !this.state.startDate || !this.state.spent || !this.state.budget) {
      opts['disabled'] = 'disabled'
    }
    return (
      <div styleName="container">

        <div styleName="label-title">{'Edit Stage'}</div>
        <div />
        <div styleName="form">
          <div styleName="label-layer">
            <div styleName={'label-title'}>{'Start Date'}</div>
            <input styleName="input" onChange={this.onStartDateChange} value={this.state.startDate} type="date" placeholder={'Start Date'}/>
          </div>
          <div styleName="label-layer">
            <div styleName={'label-title'}>{'Duration'}</div>
            <input styleName="input" onChange={this.onDurationChange} value={this.state.duration} type="number" placeholder={'Duration'}/>
          </div>
          <div styleName="label-layer">
            <div styleName={'label-title'}>{'Spent'}</div>
            <input styleName="input" onChange={this.onSpentChange} value={this.state.spent} type="number" placeholder={'Spent'}/>
          </div>
          <div styleName="label-layer">
            <div styleName={'label-title'}>{'Budget'}</div>
            <input styleName="input" onChange={this.onBudgetChange} value={this.state.budget} type="number" placeholder={'Budget'}/>
          </div>
          <div styleName="group-bottom">
            <button onClick={props.cancel} className="tc-btn tc-btn-default"><strong>{'Cancel'}</strong></button>
            <button onClick={this.submitValue} {...opts} className="tc-btn tc-btn-primary"><strong>{'Update Stage'}</strong></button>
          </div>
        </div>
      </div>
    )
  }
}

EditStageForm.defaultProps = {
  cancel: () => {},
  update: () => {},
}

EditStageForm.propTypes = {
  cancel: PT.func,
  update: PT.func,
  phase: PT.object,
  phaseIndex: PT.number
}

const mapStateToProps = () => ({})

const actionCreators = {updatePhase}

export default withRouter(connect(mapStateToProps, actionCreators)(EditStageForm))
