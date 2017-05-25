import _ from 'lodash'
import React, { PropTypes as PT, Component } from 'react'
import Sticky from 'react-stickynode'
import config from '../../../config/projectWizard'
import WizardHeader from '../components/WizardHeader'
import './FillProjectDetailsContainer.scss'
import ProjectBasicDetailsForm from '../components/ProjectBasicDetailsForm'
import ProjectOutline from '../components/ProjectOutline'
import typeToSpecification from '../../../config/projectSpecification/typeToSpecification'

class FillProjectDetailsContainer extends Component  {
  constructor(props) {
    super(props)
    this.state = { project: {} }
  }

  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ project: nextProps.project })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(
        _.isEqual(nextProps.project, this.props.project)
     && _.isEqual(nextState.project, this.state.project)
     && _.isEqual(nextProps.dirtyProject, this.props.dirtyProject)
     && _.isEqual(nextProps.error, this.props.error)
   )
  }

  render() {
    const { project, dirtyProject, processing, submitBtnText, onProjectNameChange,  onProjectRefChange } = this.props
    const product = _.get(project, 'details.products[0]')
    const projectName = _.get(project, 'name')
    const projectRef = _.get(project, 'details.utm.code', '')
    const projectTypeId = _.get(project, 'type')
    const subConfig = config[_.findKey(config, {id : projectTypeId})]
    const productName = _.findKey(subConfig.subtypes, {id : product})

    let specification = 'topcoder.v1'
    if (product)
      specification = typeToSpecification[product]
    let sections = require(`../../../config/projectQuestions/${specification}`).basicSections
    return (
      <div className="FillProjectDetailsContainer">
        <div className="header">
          <h1>Let's setup your { productName } project</h1>
          <button className="tc-btn tc-btn-default tc-btn-sm">Start over</button>
        </div>
        <section className="two-col-content content">
          <div className="container">
            <div className="left-area">
              <ProjectBasicDetailsForm
                project={project}
                sections={sections}
                isEdittable={true}
                submitHandler={this.props.onCreateProject}
                saving={processing}
                route={this.props.route}
                onProjectChange={this.props.onProjectChange}
                submitBtnText={ submitBtnText }
              />
            </div>
            <div className="right-area">
              <Sticky top={80}>
                <ProjectOutline project={ dirtyProject } />
                <div className="right-area-footer">In 24 hours our project managers will contact you for more information and a detailed quote that accurately reflects your project needs.</div>
              </Sticky>
            </div>
          </div>
        </section>
      </div>
    )
  }
}

FillProjectDetailsContainer.propTypes = {
  // onProjectChange: PT.func.isRequired,
  onCreateProject: PT.func.isRequired,
  project: PT.object.isRequired,
  currentMemberRole: PT.string,
  processing: PT.bool,
  error: PT.oneOfType([
    PT.bool,
    PT.object
  ])
}

export default FillProjectDetailsContainer