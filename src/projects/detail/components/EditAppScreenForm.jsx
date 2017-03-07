import React, { Component, PropTypes } from 'react'
import { Formsy } from 'appirio-tech-react-components'
import SpecScreenQuestions from './SpecScreenQuestions'

class EditAppScreenForm extends Component {

  constructor(props) {
    super(props)
    this.onValidate = this.onValidate.bind(this)
    this.update = this.update.bind(this)
  }

  componentWillMount() {
    this.setState({
      screen: Object.assign({}, this.props.screen),
      isValid: false
    })
  }

  componentDidMount() {
    if (this.props.screen.name.trim() === '' || this.props.screen.description.trim() === '') {
      this.onValidate(false)
    }
  }

  componentWillReceiveProps(nextProps) {
    const updatedScreen = Object.assign({}, nextProps.screen)
    this.setState({
      screen: updatedScreen
    })
  }

  onValidate(isValid) {
    if (isValid === this.state.isValid) {
      return
    }
    const screen = this.state.screen
    if (!isValid) {
      screen.isInvalid = true
    } else {
      delete screen.isInvalid
    }
    this.props.validateScreen(screen)
    this.setState({ isValid })
  }

  update(model, isChanged) {
    if (isChanged) this.props.onUpdate(model)
  }

  render() {
    let { questions } = this.props
    let { screen } = this.state

    return (
      <Formsy.Form
        onInvalid={() => this.onValidate(false)}
        onValid={() => this.onValidate(true)}
        onChange={this.update}
      >
        <SpecScreenQuestions
        questions={questions}
        screen={screen}
        />

        <div className="edit-screen-footer">
          <button className="tc-btn tc-btn-default tc-btn-md"
            onClick={(evt) => {
              evt.preventDefault()
              this.props.onDelete()
            }}
          >
            Delete screen
          </button>
        </div>
      </Formsy.Form>
    )
  }
}

EditAppScreenForm.propTypes = {
  screen: PropTypes.object,
  questions: PropTypes.arrayOf(PropTypes.object).isRequired,
  screenNumberReached: PropTypes.bool
}

export default EditAppScreenForm
