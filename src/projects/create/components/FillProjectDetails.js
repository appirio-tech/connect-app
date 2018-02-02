import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import React, { Component } from 'react'
import PT from 'prop-types'
import Sticky from 'react-stickynode'

import { findProduct } from '../../../config/projectWizard'
import './FillProjectDetails.scss'
import ProjectBasicDetailsForm from '../components/ProjectBasicDetailsForm'
import ProjectOutline from '../components/ProjectOutline'
import typeToSpecification from '../../../config/projectSpecification/typeToSpecification'

class FillProjectDetails extends Component  {
  constructor(props) {
    super(props)
    this.createMarkup = this.createMarkup.bind(this)
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
      isEqual(nextProps.project, this.props.project)
     && isEqual(nextState.project, this.state.project)
     && isEqual(nextProps.dirtyProject, this.props.dirtyProject)
     && isEqual(nextProps.error, this.props.error)
    )
  }

  createMarkup(product) {
    return {__html: get(product, 'formTitle', `Let's setup your ${ product.name } project`) }
  }

  render() {
    const { project, dirtyProject, processing, submitBtnText } = this.props
    const productId = get(project, 'details.products[0]')
    const product = findProduct(productId)

    let specification = 'topcoder.v1'
    if (productId)
      specification = typeToSpecification[productId]
    const sections = require(`../../../config/projectQuestions/${specification}`).basicSections
    return (
      <div className="FillProjectDetailsWrapper">
        <div className="header headerFillProjectDetails" />
        <div className="FillProjectDetails">
          <div className="header">
            <h1 dangerouslySetInnerHTML = {this.createMarkup(product)}  />
          </div>
          <section className="two-col-content content">
            <div className="container">
              <div className="left-area">
                <div className="left-area-content">
                  <ProjectBasicDetailsForm
                    project={project}
                    sections={sections}
                    isEdittable
                    submitHandler={this.props.onCreateProject}
                    saving={processing}
                    onProjectChange={this.props.onProjectChange}
                    submitBtnText={ submitBtnText }
                  />
                </div>
                <div className="left-area-footer">
                  <span>{ get(product, 'formDesclaimer') }</span>
                </div>
              </div>
              <div className="right-area">
                <Sticky top={20}>
                  <ProjectOutline project={ dirtyProject } />
                  <div className="right-area-footer">In 24 hours our project managers will contact you for more information and a detailed quote that accurately reflects your project needs.</div>
                </Sticky>
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
  onCreateProject: PT.func.isRequired,
  onChangeProjectType: PT.func.isRequired,
  project: PT.object.isRequired,
  userRoles: PT.arrayOf(PT.string),
  processing: PT.bool,
  error: PT.oneOfType([
    PT.bool,
    PT.object
  ])
}

export default FillProjectDetails
