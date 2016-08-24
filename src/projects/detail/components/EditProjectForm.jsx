import React, { Component, PropTypes } from 'react'
import { Formsy } from 'appirio-tech-react-components'
import _ from 'lodash'

import SpecSection from './SpecSection'

class EditProjectForm extends Component {

  constructor(props) {
    super(props)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.submit = this.submit.bind(this)
  }

  componentWillMount() {
    this.setState({
      project: _.cloneDeep(this.props.project),
      canSubmit: false
    })
  }

  enableButton() {
    this.setState(_.assign({}, this.state, {canSubmit: true}))
  }

  disableButton() {
    this.setState(_.assign({}, this.state, {canSubmit: false}))
  }

  submit(project) {
    console.log(project)
  }

  render() {
    const { project, sections } = this.props
    const renderSection = (section, idx) => (
      <SpecSection key={idx} {...section} project={project} showFeaturesDialog={this.showFeaturesDialog}/>
    )

    return (
      <Formsy.Form onValidSubmit={this.submit} onValid={this.enableButton} onInvalid={this.disableButton}>
        {sections.map(renderSection)}
        {/*
          Uncomment this if we want to enable a floating save button
        <div className="button-area">
          <button className="tc-btn tc-btn-primary tc-btn-md" type="submit" disabled={!this.state.canSubmit}>Save Changes</button>
        </div>
        */}
      </Formsy.Form>
    )
  }
}

EditProjectForm.propTypes = {
  project: PropTypes.object.isRequired,
  sections: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default EditProjectForm
