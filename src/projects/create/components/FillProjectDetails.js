import _ from 'lodash'
import React, { Component } from 'react'
import PT from 'prop-types'

import './FillProjectDetails.scss'
import ProjectBasicDetailsForm from '../components/ProjectBasicDetailsForm'
// import ProjectEstimationSection from '../../detail/components/ProjectEstimationSection'
import ModalControl from '../../../components/ModalControl'
import TailLeft from '../../../assets/icons/arrows-16px-1_tail-left.svg'
import HeaderWithProgress from './HeaderWithProgress'

class FillProjectDetails extends Component  {
  constructor(props) {
    super(props)
    this.createMarkup = this.createMarkup.bind(this)
    this.handleStepChange = this.handleStepChange.bind(this)
    this.state = { project: {}, currentWizardStep: null }
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ project: nextProps.project })
  }

  handleStepChange(currentWizardStep) {
    this.setState({currentWizardStep})
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
      _.isEqual(nextProps.project, this.props.project)
     && _.isEqual(nextProps.dirtyProject, this.props.dirtyProject)
     && _.isEqual(nextState.project, this.state.project)
     && _.isEqual(nextProps.error, this.props.error)
    )
  }

  createMarkup(projectTemplate) {
    return {__html: _.get(projectTemplate, 'scope.formTitle', `Let's setup your ${ projectTemplate.name } project`) }
  }

  render() {
    const { project, processing, submitBtnText, onBackClick, projectTemplates, dirtyProject, /* templates,*/ productTemplates } = this.props
    const { currentWizardStep } = this.state
    const projectTemplateId = _.get(project, 'templateId')
    const projectTemplate = _.find(projectTemplates, { id: projectTemplateId })
    const formDisclaimer = _.get(projectTemplate, 'scope.formDisclaimer')

    const template = projectTemplate.scope

    return (
      <div className="FillProjectDetailsWrapper">
        <div className="header headerFillProjectDetails" />
        <div className="FillProjectDetails">
          <div className="header">
            <ModalControl
              className="back-button"
              icon={<TailLeft className="icon-tail-left"/>}
              label="back"
              onClick={onBackClick}
            />
            {!template.wizard.enabled ? (
              <h1 dangerouslySetInnerHTML = {this.createMarkup(projectTemplate)}  />
            ) : <HeaderWithProgress progress={0.53} template={template} step={currentWizardStep} project={dirtyProject} />}
          </div>
          <section className="two-col-content content">
            <div className="container">
              <div className="left-area">
                <div className="left-area-content">
                  <ProjectBasicDetailsForm
                    project={project}
                    dirtyProject={dirtyProject}
                    template={template}
                    isEditable
                    submitHandler={this.props.onCreateProject}
                    saving={processing}
                    onProjectChange={this.props.onProjectChange}
                    submitBtnText={ submitBtnText }
                    productTemplates={productTemplates}
                    onStepChange={this.handleStepChange}
                  />
                  {/* <ProjectEstimationSection project={dirtyProject} templates={templates} /> */}
                </div>
                {formDisclaimer && (
                  <div className="left-area-footer">
                    <span>{formDisclaimer}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }
}

FillProjectDetails.propTypes = {
  // onProjectChange: PT.func.isRequired,
  onBackClick: PT.func.isRequired,
  onCreateProject: PT.func.isRequired,
  onChangeProjectType: PT.func.isRequired,
  project: PT.object.isRequired,
  projectTemplates: PT.array.isRequired,
  productTemplates: PT.array.isRequired,
  userRoles: PT.arrayOf(PT.string),
  processing: PT.bool,
  templates: PT.array.isRequired,
  error: PT.oneOfType([
    PT.bool,
    PT.object
  ]),
}

export default FillProjectDetails
