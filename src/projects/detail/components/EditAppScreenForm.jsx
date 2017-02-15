import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import update from 'react-addons-update'
import { Formsy, Icons } from 'appirio-tech-react-components'

import SpecScreenQuestions from './SpecScreenQuestions'

class EditAppScreenForm extends Component {

  constructor(props) {
    super(props)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.submit = this.submit.bind(this)
    this.update = this.update.bind(this)
  }

  componentWillMount() {
    this.setState({
      screen: Object.assign({}, this.props.screen),
      canSubmit: false
    })
  }

  componentWillReceiveProps(nextProps) {
    let updatedScreen = Object.assign({}, nextProps.screen)
    this.setState({
      screen: updatedScreen,
      canSubmit: false
    })
  }

  enableButton() {
    this.setState( { canSubmit: true })
  }

  disableButton() {
    this.setState({ canSubmit: false })
  }

  submit(model) {
    if (this.props.new)
      this.props.onSubmit(model)
    else
      this.props.onDelete()
  }

  update(model, isChanged) {
    if (!this.props.new && isChanged) this.props.onUpdate(model)
  }

  render() {
    let { questions } = this.props
    let { screen } = this.state
    
    return (
      <Formsy.Form
        onInvalid={this.disableButton}
        onValid={this.enableButton}
        onValidSubmit={this.submit}
        onChange={this.update}
      >
        <SpecScreenQuestions
          questions={questions}
          screen={screen}
        />
        <div className="edit-screen-footer">
          {this.props.new ? (
            <button className="tc-btn tc-btn-default tc-btn-md"
              type="submit" disabled={!this.state.canSubmit}>
              Define another screen
            </button>
          ) : (
            <button className="tc-btn tc-btn-default tc-btn-md"
              onClick={(evt) => {
                evt.preventDefault()
                this.props.onDelete()
              }}>
              Delete screen
            </button>
          )}
        </div>
      </Formsy.Form>
    )
  }
}

EditAppScreenForm.propTypes = {
  new: PropTypes.bool.isRequired,
  screen: PropTypes.object,
  questions: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default EditAppScreenForm
