import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import _ from 'lodash'
import update from 'react-addons-update'
import { Formsy, Icons } from 'appirio-tech-react-components'
import './ProjectBasicDetailsForm.scss'

import SpecSection from '../../detail/components/SpecSection'

class ProjectBasicDetailsForm extends Component {

  constructor(props) {
    super(props)
    this.enableButton = this.enableButton.bind(this)
    this.disableButton = this.disableButton.bind(this)
    this.submit = this.submit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillMount() {
    this.setState({
      project: Object.assign({}, this.props.project),
      canSubmit: false
    })
  }

  componentWillReceiveProps(nextProps) {
    // we receipt property updates from PROJECT_DIRTY REDUX state
    if (nextProps.project.isDirty) return
    let updatedProject = Object.assign({}, nextProps.project)
    this.setState({
      project: updatedProject,
      isSaving: false,
      canSubmit: false
    })
  }

  isChanged() {
    // We check if this.refs.form exists because this may be called before the
    // first render, in which case it will be undefined.
    return (this.refs.form && this.refs.form.isChanged())
  }

  enableButton() {
    this.setState( { canSubmit: true })
  }

  disableButton() {
    this.setState({ canSubmit: false })
  }

  submit(model) {
    console.log('submit', this.isChanged())
    this.setState({isSaving: true })
    this.props.submitHandler(model)
  }

  /**
   * Handles the change event of the form.
   *
   * @param change changed form model in flattened form
   * @param isChanged flag that indicates if form actually changed from initial model values
   */
  handleChange(change) {
    // removed check for isChanged argument to fire the PROJECT_DIRTY event for every change in the form
    // this.props.fireProjectDirty(change)
    this.props.onProjectChange(change)
  }


  render() {
    const { isEdittable, sections, submitBtnText } = this.props
    const { project, canSubmit } = this.state
    const renderSection = (section, idx) => {
      return (
        <div key={idx} className="ProjectBasicDetailsForm">
          <div className="sections">
            <SpecSection
              {...section}
              project={project}
              sectionNumber={idx + 1}
              showFeaturesDialog={ () => {} }//dummy
              resetFeatures={ () => {} }//dummy
              // TODO we shoudl not update the props (section is coming from props)
              // further, it is not used for this component as we are not rendering spec screen section here
              validate={(isInvalid) => {}}//dummy
            />
          </div>
          <div className="section-footer section-footer-spec">
            <button className="tc-btn tc-btn-primary tc-btn-md"
              type="submit" disabled={(!this.isChanged() || this.state.isSaving) || !canSubmit}
            >{ submitBtnText }</button>
          </div>
        </div>
      )
    }

    return (
      <div>
        <Formsy.Form
          ref="form"
          disabled={!isEdittable}
          onInvalid={this.disableButton}
          onValid={this.enableButton}
          onValidSubmit={this.submit}
          onChange={ this.handleChange }
        >
          {sections.map(renderSection)}
        </Formsy.Form>
      </div>
    )
  }
}

ProjectBasicDetailsForm.propTypes = {
  project: PropTypes.object.isRequired,
  saving: PropTypes.bool.isRequired,
  sections: PropTypes.arrayOf(PropTypes.object).isRequired,
  isEdittable: PropTypes.bool.isRequired,
  submitHandler: PropTypes.func.isRequired
}

export default ProjectBasicDetailsForm
