'use strict'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import Sticky from 'react-stickynode'

import ProjectSpecSidebar from '../components/ProjectSpecSidebar'
import FooterV2 from '../../../components/FooterV2/FooterV2'
import EditProjectForm from '../components/EditProjectForm'
import { findProduct } from '../../../config/projectWizard'
import { updateProject, fireProjectDirty, fireProjectDirtyUndo } from '../../actions/project'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import typeToSpecification from '../../../config/projectSpecification/typeToSpecification'

require('./Specification.scss')


// This handles showing a spinner while the state is being loaded async
const enhance = spinnerWhileLoading(props => !props.processing)
const EnhancedEditProjectForm = enhance(EditProjectForm)

class SpecificationContainer extends Component {
  constructor(props) {
    super(props)
    this.saveProject = this.saveProject.bind(this)
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
     && _.isEqual(nextProps.error, this.props.error)
    )
  }
  saveProject(model) {
    // compare old & new
    this.props.updateProject(this.props.project.id, model)
  }

  render() {
    const { project, currentMemberRole, processing, productIndexVal } = this.props
    const productIndex = productIndexVal
    const productId = _.get(project, 'details.products['+ productIndex+'].productType')
    const product = findProduct(productId)

    let productObject = ''
    productObject = project.details.products[productIndex]
    //let specification = 'topcoder.v1'
    let specification = ''
    const productType = productObject.productType
    if (productType)
      specification = typeToSpecification[productType]
    const sections = require(`../../../config/projectQuestions/${specification}`).default

    return (
      <section className="two-col-content content specificationContainer">
        <div className="container">
          <div className="left-area">
            <Sticky top={80}>
              <ProjectSpecSidebar 
                project={project} 
                sections={sections} 
                currentMemberRole={currentMemberRole}
                productIndex={productIndex}
              />
              <FooterV2 />
            </Sticky>
          </div>

          <div className="right-area">
            <EnhancedEditProjectForm
              project={project}
              sections={sections}
              isEdittable={!!currentMemberRole}
              submitHandler={this.saveProject}
              saving={processing}
              route={this.props.route}
              fireProjectDirty={ this.props.fireProjectDirty }
              fireProjectDirtyUndo= { this.props.fireProjectDirtyUndo }
              productObject = {productObject}
              productIndex={productIndex}
            />
            <div className="right-area-footer">
              { _.get(product, 'formDesclaimer') }
            </div>
          </div>

        </div>
      </section>
    )
  }
}

SpecificationContainer.propTypes = {
  project: PropTypes.object.isRequired,
  currentMemberRole: PropTypes.string,
  processing: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ])
}

const mapStateToProps = ({projectState, loadUser, projectSpecification}) => {
  return {
    processing: projectState.processing,
    error: projectState.error,
    currentUserId: parseInt(loadUser.user.id),
    productIndexVal: projectSpecification.productIndex
  }
}

const mapDispatchToProps = { updateProject, fireProjectDirty, fireProjectDirtyUndo }

export default connect(mapStateToProps, mapDispatchToProps)(SpecificationContainer)
