import React, { PropTypes } from 'react'
import { Tabs, Tab, TCFormFields } from 'appirio-tech-react-components'
import _ from 'lodash'
import SpecQuestions from './SpecQuestions'
import FileListContainer from './FileListContainer'
import SpecScreens from './SpecScreens'


const SpecSection = props => {
  const {project, resetFeatures, showFeaturesDialog, id, title, description, subSections} = props
  console.log('SpecSection', props)
  const renderSubSection = (subSection, idx) => (
    <div key={idx} className="section-features-module" id={[id, subSection.id].join('-')}>
      <div className="sub-title">
        <h4 className="title">{typeof subSection.title === 'function' ? subSection.title(project): subSection.title } <span>*</span></h4>
      </div>
      <div className="content-boxs">
        {renderChild(subSection)}
      </div>
    </div>
  )

  const renderChild = props => {
    const {type} = props
    switch(type) {
    case 'tabs': {
      const tabs = _.get(props, 'tabs')
      const renderTab = (t, idx) => (
        <Tab key={idx+1} eventKey={idx+1} title={t.title}>
          {renderChild(t)}
        </Tab>
      )
      return (
        <Tabs defaultActiveKey={1}>
          {tabs.map(renderTab)}
        </Tabs>
      )
    }
    case 'questions':
      return (
        <SpecQuestions
          showFeaturesDialog={showFeaturesDialog}
          resetFeatures={resetFeatures}
          questions={props.questions}
          project={project}
        />
      )
    case 'notes':
      return (
        <div>
          <div className="textarea-title">
            {props.description}
          </div>
          <TCFormFields.Textarea
            name={props.fieldName}
            value={_.get(project, props.fieldName) || ''}
          />
        </div>
      )
    case 'files': {
      const files = _.get(project, props.fieldName, [])
      return <FileListContainer projectId={project.id} files={files} />
    }
    case 'screens': {
      const screens = _.get(project, props.fieldName, [])
      return (
        <SpecScreens
          name={props.fieldName}
          screens={screens}
          questions={props.questions}
          project={project}
        />
      )
    }
    case 'project-name': {
      const refCodeFieldName = 'details.utm.code'
      return (
        <div className="project-name-section">
          <div className="dashed-bottom-border">
            <h5 className="project-name">{project.name}</h5>
          </div>
          <div className="textinput-refcode">
            <TCFormFields.TextInput
              name={refCodeFieldName}
              placeholder="REF code"
              value={_.get(project, refCodeFieldName, undefined)}
              wrapperClass="project-refcode"
              maxLength={5}
            />
            <div className="refcode-desc">
              Optional
            </div>
          </div>
        </div>
      )
    }
    default:
      return <noscript />
    }
  }

  return (
    <div className="right-area-item" id={id}>
      <div className="boxes">
        <h2 className="big-titles" id={id}>
          {title}
        </h2>
        <p className="gray-text">
          {description}
        </p>
        {subSections.map(renderSubSection)}
      </div>
    </div>
  )
}

SpecSection.propTypes = {
  project: PropTypes.object.isRequired
}

export default SpecSection
