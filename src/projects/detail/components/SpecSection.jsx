import React from 'react'
import PropTypes from 'prop-types'
import qs from 'query-string'
import Tabs from 'appirio-tech-react-components/components/Tabs/Tabs'
import Tab from 'appirio-tech-react-components/components/Tabs/Tab'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields
import _ from 'lodash'
import SpecQuestions from './SpecQuestions'
import FileListContainer from './FileListContainer'
import SpecScreens from './SpecScreens'
import { PROJECT_NAME_MAX_LENGTH, PROJECT_REF_CODE_MAX_LENGTH } from '../../../config/constants'
import { scrollToAnchors } from '../../../components/ScrollToAnchors'

// icons for "tiled-radio-group" field type
import NumberText from '../../../components/NumberText/NumberText'
import IconTechOutlineMobile from  '../../../assets/icons/icon-tech-outline-mobile.svg'
import IconTechOutlineTablet from  '../../../assets/icons/icon-tech-outline-tablet.svg'
import IconTechOutlineDesktop from  '../../../assets/icons/icon-tech-outline-desktop.svg'
import IconTechOutlineWatchApple from  '../../../assets/icons/icon-tech-outline-watch-apple.svg'
import IconTcSpecTypeSerif from  '../../../assets/icons/icon-tc-spec-type-serif.svg'
import IconTcSpecTypeSansSerif from  '../../../assets/icons/icon-tc-spec-type-sans-serif.svg'
import IconTcSpecIconTypeColorHome from  '../../../assets/icons/icon-tc-spec-icon-type-color-home.svg'
import IconTcSpecIconTypeOutlineHome from  '../../../assets/icons/icon-tc-spec-icon-type-outline-home.svg'
import IconTcSpecIconTypeGlyphHome from  '../../../assets/icons/icon-tc-spec-icon-type-glyph-home.svg'

// map string values to icon components for "tiled-radio-group" field type
const tiledRadioGroupIcons = {
  NumberText,
  'icon-tech-outline-mobile': IconTechOutlineMobile,
  'icon-tech-outline-tablet': IconTechOutlineTablet,
  'icon-tech-outline-desktop': IconTechOutlineDesktop,
  'icon-tech-outline-watch-apple': IconTechOutlineWatchApple,
  'icon-tc-spec-type-serif': IconTcSpecTypeSerif,
  'icon-tc-spec-type-sans-serif': IconTcSpecTypeSansSerif,
  'icon-tc-spec-icon-type-color-home': IconTcSpecIconTypeColorHome,
  'icon-tc-spec-icon-type-outline-home': IconTcSpecIconTypeOutlineHome,
  'icon-tc-spec-icon-type-glyph-home': IconTcSpecIconTypeGlyphHome,
}

const SpecSection = props => {
  const {
    project,
    dirtyProject,
    isProjectDirty,
    resetFeatures,
    showFeaturesDialog,
    id,
    title,
    description,
    validate,
    sectionNumber
  } = props

  // make a copy to avoid modifying redux store
  const subSections = _.cloneDeep(props.subSections || [])

  // replace string icon values in the "tiled-radio-group" questions with icon components
  subSections.forEach((subSection) => {
    (subSection.questions || []).forEach(question => {
      if (question.type === 'tiled-radio-group') {
        question.options.forEach((option) => {
          option.icon = tiledRadioGroupIcons[option.icon]
        })
      }
    })
  })

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
      const projectLatest = isProjectDirty ? dirtyProject : project
      const files = _.get(projectLatest, props.fieldName, [])
      return <FileListContainer project={projectLatest} files={files} />
    }
    case 'screens': {
      const screens = _.get(project, props.fieldName, [])
      return (
        <SpecScreens
          name={props.fieldName}
          screens={screens}
          questions={props.questions}
          project={project}
          dirtyProject={dirtyProject}
          onValidate={onValidate}
        />
      )
    }
    case 'project-name': {
      const refCodeFieldName = 'details.utm.code'
      const refCode = _.get(project, refCodeFieldName, undefined)
      const queryParamRefCode = qs.parse(window.location.search).refCode
      return (
        <div className="project-name-section">
          <div className="editable-project-name">
            <TCFormFields.TextInput
              name="name"
              placeholder="Project Name"
              value={_.get(project, 'name', undefined)}
              wrapperClass="project-name"
              maxLength={ PROJECT_NAME_MAX_LENGTH }
              required={props.required}
              validations={props.required ? 'isRequired' : null}
              validationError={props.validationError}
              theme="paper-form-dotted"
            />
          </div>
          { !queryParamRefCode &&
            <div className="textinput-refcode">
              <TCFormFields.TextInput
                name={refCodeFieldName}
                placeholder="REF code"
                value={ refCode }
                wrapperClass="project-refcode"
                maxLength={ PROJECT_REF_CODE_MAX_LENGTH }
                theme="paper-form-dotted"
                disabled={ queryParamRefCode && queryParamRefCode.length > 0 }
              />
              <div className="refcode-desc">
                Optional
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

export default scrollToAnchors(SpecSection)
