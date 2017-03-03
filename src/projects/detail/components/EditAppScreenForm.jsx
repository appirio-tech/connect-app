import React, { Component, PropTypes } from 'react'
import { Formsy } from 'appirio-tech-react-components'

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
    const updatedScreen = Object.assign({}, nextProps.screen)
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
    this.props.onSubmit(model)
  }

  update(model, isChanged) {
    if (!this.props.isNew && isChanged) this.props.onUpdate(model)
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
          {this.props.isNew && !this.props.screenNumberReached ? (
            <button className="tc-btn tc-btn-default tc-btn-md"
              type="submit" disabled={this.props.screenNumberReached || !this.state.canSubmit}
            >
              Save &amp; Add new screen
            </button>
          ) : (
            <button className="tc-btn tc-btn-default tc-btn-md"
              onClick={(evt) => {
                evt.preventDefault()
                this.props.onDelete()
              }}
            >
              Delete screen
            </button>
          )}
        </div>
      </Formsy.Form>
    )
  }
}

EditAppScreenForm.propTypes = {
  isNew: PropTypes.bool.isRequired,
  screen: PropTypes.object,
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  screenNumberReached: PropTypes.bool
}

export default EditAppScreenForm
