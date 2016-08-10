'use strict'

import React, { Component } from 'react'
import Modal from 'react-modal'
import ProjectSpecSidebar from './ProjectSpecSidebar'
import DefineFeature from '../../FeatureSelector/DefineFeature'
import { XMarkIcon } from 'appirio-tech-react-components'

require('./Specification.scss')

class ProjectSpecification extends Component {
  constructor(props) {
    super(props)

    this.state = { showFeaturesDialog : false}
    this.showFeaturesDialog = this.showFeaturesDialog.bind(this)
    this.hideFeaturesDialog = this.hideFeaturesDialog.bind(this)
  }

  showFeaturesDialog() {
    this.setState({ showFeaturesDialog : true })
  }

  hideFeaturesDialog() {
    this.setState({ showFeaturesDialog : false })
  }

  render() {
    const {project} = this.props
    const {showFeaturesDialog} = this.state
    const _debug = JSON.stringify(project, null, 2)
    const details = <pre>{_debug}</pre>
    return (
      <section className="two-col-content content">
        <div className="container">
          <Modal
            isOpen={ showFeaturesDialog }
            className="feature-selection-dialog"
            onRequestClose={this.hideFeaturesDialog }
          >
            <DefineFeature />
            <div onClick={ this.hideFeaturesDialog } className="feature-selection-dialog-close">
              <XMarkIcon />
            </div>
          </Modal>
          <div className="left-area">
            <ProjectSpecSidebar project={project} />
          </div>

          {/* right area --- THIS IS TEST CODE */}
          <div className="right-area">
            <div className="right-area-item" id="design-spec" >
              <div className="boxes">
                <h2 className="big-titles">Design Specification</h2>
                  <p className="gray-text">
                    Before we can put the Topcoder community at work we’ll need a bit more info about the
                    details of the problems you are trying to solve.
                  </p>
                  <div className="section-features-module" id="design-spec-features">
                    <div className="bottom-border-titles">
                      <h4 className="title">What are the major features of your app?</h4>
                      <div className="section-actions">
                        <button href="javascript:;"  onClick={ this.showFeaturesDialog } className="tc-btn-default tc-btn-sm">Add / Edit features</button>
                      </div>
                    </div>
                    <div className="bg-contents">content</div>
                    <div className="content-boxs">
                      <div className="tabs">
                        <ul>
                          <li><a href="#">Define my app</a></li>
                          <li className="active"><a href="#">Upload a speck document</a></li>
                        </ul>
                      </div>
                      {/* end .tabs */}
                      <div className="contents-list part-one">
                        <div className="item dashed-bottom-border clearfix">
                          <i className="icons icon-box"></i>
                          <div className="right-area">
                            <h4 className="title">Search</h4>
                            <p className="txt">Allow users to register and log in using third-party services such as Facebook, Twitter.</p>
                          </div>
                        </div>
                        {/* end .item */}
                        <div className="item dashed-bottom-border  clearfix">
                          <i className="icons icon-box"></i>
                          <div className="right-area">
                            <h4 className="title">Geolocation feature</h4>
                            <p className="txt">
                              Add this feature if your app has any geographic location-based functionality, such as showing
                              store locations on a map or illustrating the progress of a delivery. Please specify your desired functionality below.
                            </p>
                          </div>
                        </div>
                        {/* end .item */}
                        <div className="item dashed-bottom-border  clearfix">
                          <i className="icons icon-magic"></i>
                          <div className="right-area">
                            <h4 className="title">Slack bot integration</h4>
                            <p className="txt">
                              My app needs to be able to connect ot Slack and transmit all data of people using it in real time,
                              so we can follow up with them almost instantly.
                            </p>
                          </div>
                        </div>
                        {/* end .item */}
                      </div>
                      {/* end .contents-list */}
                    </div>
                    <div className="content-boxs"></div>
                </div>
              </div>

            </div> {/* end right-area-item */}

            <div className="right-area-item" id="raw-json" >
              <div className="boxes">
                {details}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

ProjectSpecification.propTypes = {}

ProjectSpecification.defaultProps = {}

export default ProjectSpecification
