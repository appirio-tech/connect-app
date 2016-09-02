import React from 'react'
import './ProjectSpecification.scss'
import Panel from '../Panel/Panel'

const ProjectSpecification = () => (
  <Panel className="panel-gray action-card">
    <div className="panel-specifications">
      <div className="specifications-title">
        Connect mobile - web app
      </div>
      <div className="specifications-platforms">
        <div className="project-icons">
          <div className="icon-set">
            <div className="icon icon-iphone">
              iPhone
            </div>
            <div className="icon icon-ipad">
              iPad
            </div>
            <div className="icon icon-web">
              Web
            </div>
          </div>
        </div>
      </div>
      <div className="specifications-list">
        <div className="specifications-header">
          <div className="specifications-label">
            App Definition
          </div>
          <span className="value highlight">* required</span>
        </div>
        <div className="specifications-row">
          <div className="specifications-label">
            Questions and Specification
            <span className="highlight">*</span>
          </div>
          <span className="value">1 of 3</span>
        </div>
        <div className="specifications-row">
          <div className="specifications-label">
            Features
            <span className="highlight">*</span>
          </div>
          <span className="value"><i className="tick"/></span>
        </div>
        <div className="specifications-row">
          <div className="specifications-label">
            Notes
          </div>
          <span className="value"><i className="tick"/></span>
        </div>
        <div className="specifications-row">
          <div className="specifications-label">
            Project Files
            <span className="highlight">*</span>
          </div>
          <span className="value value-alt">-</span>
        </div>
      </div>
      <div className="panel-buttons">
        <button className="tc-btn tc-btn-primary tc-btn-md">Complete Project Specification</button>
      </div>
    </div>
  </Panel>
)

export default ProjectSpecification
