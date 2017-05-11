import React, { PropTypes } from 'react'
import { Tabs, Tab, TCFormFields } from 'appirio-tech-react-components'
import _ from 'lodash'
import SpecQuestions from './SpecQuestions'
import FileListContainer from './FileListContainer'
import SpecScreens from './SpecScreens'
import { PROJECT_STATUS_DRAFT, PROJECT_NAME_MAX_LENGTH, PROJECT_REF_CODE_MAX_LENGTH } from '../../../config/constants'


const SpecSection = props => {
  const {
    project,
    dirtyProject,
    resetFeatures,
    showFeaturesDialog,
    id,
    title,
    description,
    subSections,
    validate,
    sectionNumber
  } = props
  const renderSubSection = (subSection, idx) => (
    <div key={idx} className="section-features-module" id={[id, subSection.id].join('-')}>
      {
        !subSection.hideTitle &&
        <div className="sub-title">
          <h4 className="title">
            {typeof subSection.title === 'function' ? subSection.title(project): subSection.title } 
            <span>{((typeof subSection.required === 'function') ? subSection.required(project, subSections) : subSection.required) ? '*' : ''}</span>
          </h4>
        </div>
      }
      <div className="content-boxs">
        {renderChild(subSection)}
      </div>
    </div>
  )

  const onValidate = (isInvalid) => validate(isInvalid)

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
          dirtyProject={dirtyProject}
          isRequired={props.required}
        />
      )
    case 'notes':
      return (
        <div>
          <div className="textarea-title">
            {props.description}
          </div>
          <TCFormFields.Textarea
            autoResize
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
          onValidate={onValidate}
        />
      )
    }
    case 'project-name': {
      const refCodeFieldName = 'details.utm.code'
      const refCode = _.get(project, refCodeFieldName, undefined)
      return (
        <div className="project-name-section">
          { project.status === PROJECT_STATUS_DRAFT &&
            <div className="editable-project-name">
              <TCFormFields.TextInput
                name="name"
                placeholder="Project Name"
                value={_.get(project, 'name', undefined)}
                wrapperClass="project-name"
                maxLength={ PROJECT_NAME_MAX_LENGTH }
              />
            </div>
          }
          { project.status !== PROJECT_STATUS_DRAFT &&
            <div className="dashed-bottom-border">
              <h5 className="project-name">{project.name}</h5>
            </div>
          }
          { project.status === PROJECT_STATUS_DRAFT &&
            <div className="textinput-refcode">
              <TCFormFields.TextInput
                name={refCodeFieldName}
                placeholder="REF code"
                value={ refCode }
                wrapperClass="project-refcode"
                maxLength={ PROJECT_REF_CODE_MAX_LENGTH }
              />
              <div className="refcode-desc">
                Optional
              </div>
            </div>
          }
          { refCode && project.status !== PROJECT_STATUS_DRAFT &&
            <div className="read-only-refcode">
              <h5 className="project-refcode">{ refCode }</h5>
              <div className="refcode-desc">
                REF Code
              </div>
            </div>
          }
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
        <div className="section-header big-titles">
          <h2 id={id}>
            {typeof title === 'function' ? title(project, true): title }
          </h2>
          <span className="section-number">{ sectionNumber }</span>
        </div>
        <p className="gray-text">
          {description}
        </p>
        {subSections.map(renderSubSection)}
      </div>
    </div>
  )
}

SpecSection.propTypes = {
  project: PropTypes.object.isRequired,
  sectionNumber: PropTypes.number.isRequired
}

export default SpecSection
