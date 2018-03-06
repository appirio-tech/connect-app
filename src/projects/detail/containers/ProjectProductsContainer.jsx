'use strict'

import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'
import Sticky from 'react-stickynode'

import { updateProject, fireProjectDirty, fireProjectDirtyUndo } from '../../actions/project'
import ProductTypeCard from '../components/ProductTypeCard'
import { updateProductIndex, addProductToProject } from '../../actions/projectSpecification'
import ProjectInfoContainer from './ProjectInfoContainer'
import { findTitle } from '../../../config/projectWizard'

require('./ProjectProducts.scss')

class ProjectProductsContainer extends Component {
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
     && _.isEqual(nextProps.error, this.props.error)
    )
  }

  updateIndex(index) {
    this.props.updateProductIndex(index)
  }

  addProduct() {
    this.props.updateProductIndex(this.props.project.details.products.length)
    this.props.addProductToProject(true)
  }

  render() {
    const { project } = this.props

    const renderStages = (product, idx) => {
      return (
        <ProductTypeCard
          key={idx}
          onClick={this.updateIndex.bind(this)}
          type={findTitle(project, idx, true)}
          buttonText={ 'View' }
          index={idx}
          projectId={project.id}
        />
      )
    }

    const DashboardView = ({project, currentMemberRole, isSuperUser }) => (
      <div>
        <div className="dashboard-container">
          <div className="left-area">
            <Sticky top={80}>
              <div className="dashboard-left-panel">
                <ProjectInfoContainer
                  currentMemberRole={currentMemberRole}
                  project={project}
                  isSuperUser={isSuperUser}
                />
              </div>
            </Sticky>
          </div>
          <div className="right-area">
            <div className="cards">
              {project.details.products.map(renderStages)}
            </div>
            <div className="add-stage-btn">
              <Link to={'stage/new-product'} onClick={this.addProduct.bind(this)}>
                <button type="button" className="tc-btn tc-btn-primary tc-btn-md" >
                    Add Stage
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
    return <DashboardView {...this.props} />
  }
}

ProjectProductsContainer.propTypes = {
  project: PropTypes.object.isRequired,
  currentMemberRole: PropTypes.string,
  processing: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object
  ])
}

const mapStateToProps = ({projectState, loadUser}) => {
  return {
    processing: projectState.processing,
    error: projectState.error,
    currentUserId: parseInt(loadUser.user.id)
  }
}

const mapDispatchToProps = { updateProject, fireProjectDirty, fireProjectDirtyUndo, updateProductIndex, addProductToProject }

export default connect(mapStateToProps, mapDispatchToProps)(ProjectProductsContainer)
