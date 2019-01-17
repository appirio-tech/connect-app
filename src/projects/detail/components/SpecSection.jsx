import React from 'react'
import PropTypes from 'prop-types'
import qs from 'query-string'
import Tabs from 'appirio-tech-react-components/components/Tabs/Tabs'
import Tab from 'appirio-tech-react-components/components/Tabs/Tab'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields
import _ from 'lodash'
import cn from 'classnames'
import SpecQuestions from './SpecQuestions'
import FileListContainer from './FileListContainer'
import SpecScreens from './SpecScreens'
import { PROJECT_NAME_MAX_LENGTH, PROJECT_REF_CODE_MAX_LENGTH, BUSINESS_UNIT_MAX_LENGTH, COST_CENTRE_MAX_LENGTH } from '../../../config/constants'
import { scrollToAnchors } from '../../../components/ScrollToAnchors'

import './SpecSection.scss'

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
import IconDontKnow from '../../../assets/icons/icon-dont-know.svg'
import IconTestStructured from '../../../assets/icons/icon-test-structured.svg'
import IconTestUnstructured from '../../../assets/icons/icon-test-unstructured.svg'
import IconUIPencil from '../../../assets/icons/ui-pencil.svg'

// map string values to icon components for "tiled-radio-group" field type
// this map contains TWO types of map, dashed and CamelCased
const tiledRadioGroupIcons = {
  NumberText,
  IconTechOutlineMobile,
  'icon-tech-outline-mobile': IconTechOutlineMobile,
  IconTechOutlineTablet,
  'icon-tech-outline-tablet': IconTechOutlineTablet,
  IconTechOutlineDesktop,
  'icon-tech-outline-desktop': IconTechOutlineDesktop,
  IconTechOutlineWatchApple,
  'icon-tech-outline-watch-apple': IconTechOutlineWatchApple,
  IconTcSpecTypeSerif,
  'icon-tc-spec-type-serif': IconTcSpecTypeSerif,
  IconTcSpecTypeSansSerif,
  'icon-tc-spec-type-sans-serif': IconTcSpecTypeSansSerif,
  IconTcSpecIconTypeColorHome,
  'icon-tc-spec-icon-type-color-home': IconTcSpecIconTypeColorHome,
  IconTcSpecIconTypeOutlineHome,
  'icon-tc-spec-icon-type-outline-home': IconTcSpecIconTypeOutlineHome,
  IconTcSpecIconTypeGlyphHome,
  'icon-tc-spec-icon-type-glyph-home': IconTcSpecIconTypeGlyphHome,
  IconDontKnow,
  'icon-dont-know': IconDontKnow,
  IconTestStructured,
  'icon-test-structured': IconTestStructured,
  IconTestUnstructured,
  'icon-test-unstructured': IconTestUnstructured,
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
    sectionNumber,
    showHidden,
    isCreation,
    addAttachment,
    updateAttachment,
    removeAttachment,
    attachmentsStorePath,
    canManageAttachments,
    startEditReadOnly,
    stopEditReadOnly,
    cancelEditReadOnly,
    productTemplates,
  } = props

  // make a copy to avoid modifying redux store
  const subSections = _.cloneDeep(props.subSections || [])

  // these types of subSections cannot be displayed as readOnly and are always writable
  const alwaysWritable = ['tabs', 'files', 'questions']

  // replace string icon values in the "tiled-radio-group" questions with icon components
  subSections.forEach((subSection) => {
    (subSection.questions || []).forEach(question => {
      if (question.type === 'tiled-radio-group') {
        question.options.forEach((option) => {
          // if icon is defined as a relative path to the icon, convert it to icon "id"
          const iconAsPath = option.icon.match(/(?:\.\.\/)+assets\/icons\/([^.]+)\.svg/)
          option.icon = tiledRadioGroupIcons[iconAsPath ? iconAsPath[1] : option.icon]
        })
      }
    })
  })

  const renderSubSection = (subSection, idx) => (
    <div key={idx} className="section-features-module" id={[id, subSection.id].join('-')}>
      {_.get(subSection, '__wizard.readOnly') && !_.includes(alwaysWritable, subSection.type) && (
        <button
          type="button"
          className="spec-section-edit-button"
          onClick={() => startEditReadOnly(_.get(subSection, '__wizard.step'))}
        >
          <IconUIPencil />
        </button>
      )}
      {
        !subSection.hideTitle &&
        <div className={ cn('sub-title', { 'read-optimized' : _.get(subSection, '__wizard.readOnly')} ) }>
          <h4 className="title">
            {typeof subSection.title === 'function' ? subSection.title(project): subSection.title }
            <span>{((typeof subSection.required === 'function') ? subSection.required(project, subSections) : subSection.required) ? '*' : ''}</span>
          </h4>
        </div>
      }
      <div className="content-boxs">
        {renderChild(subSection)}
      </div>
      {!subSection.questions && _.get(subSection, '__wizard.editReadOnly') && (
        <div className="spec-section-actions">
          <button
            type="button"
            className="tc-btn tc-btn-default tc-btn-md"
            onClick={() => cancelEditReadOnly(_.get(subSection, '__wizard.step'))}
          >
            Cancel
          </button>
          <button
            type="button"
            className="tc-btn tc-btn-primary tc-btn-md"
            onClick={() => stopEditReadOnly(_.get(subSection, '__wizard.step'))}
          >
            Update
          </button>
        </div>
      )}
    </div>
  )

  const onValidate = (isInvalid) => validate(isInvalid)

  const renderChild = props => {
    const isReadOnly = _.get(props, '__wizard.readOnly')
    const {type} = props

    let additionalClass = ''
    const spacing = _.get(props.layout, 'spacing', '')

    if (spacing) {
      additionalClass += spacing
    }

    switch(type) {
    case 'tabs': {
      const tabs = _.get(props, 'tabs')
      const renderTab = (t, idx) => (
        <Tab key={idx+1} eventKey={idx+1} title={t.title}>
          {renderChild(t)}
        </Tab>
      )
      return (
        <Tabs additionalClass={additionalClass} defaultActiveKey={1}>
          {tabs.map(renderTab)}
        </Tabs>
      )
    }
    case 'questions':
      return (
        <SpecQuestions
          additionalClass={additionalClass}
          showFeaturesDialog={showFeaturesDialog}
          resetFeatures={resetFeatures}
          questions={props.questions}
          layout={props.layout}
          project={project}
          dirtyProject={dirtyProject}
          isRequired={props.required}
          showHidden={showHidden}
          startEditReadOnly={startEditReadOnly}
          stopEditReadOnly={stopEditReadOnly}
          cancelEditReadOnly={cancelEditReadOnly}
          isProjectDirty={isProjectDirty}
          productTemplates={productTemplates}
        />
      )
    case 'notes':
      return (
        <div>
          {!isReadOnly && (
            <div className={additionalClass}>
              <div className="textarea-title">
                {props.description}
              </div>
            </div>
          )}
          <TCFormFields.Textarea
            autoResize
            name={props.fieldName}
            value={_.unescape(_.get(project, props.fieldName)) || ''}
            disabled={_.get(props, '__wizard.readOnly')}
          />
        </div>
      )
    case 'message':
      return (
        <div>
          {!isReadOnly && (
            <div className="message-title">
              {props.description}
            </div>
          )}
        </div>
      )
    case 'files': {
      const projectLatest = isProjectDirty ? dirtyProject : project
      const files = _.get(projectLatest, props.fieldName, [])
      // NOTE using category to differentiate between project and product attachments is a workaround to give ability
      // to upload attachments for products. We need to come up with a better way to handle this.
      // defaults to appDefinition to be backward compatible
      let category = _.get(props, 'category', 'appDefinition')
      // NOTE temporary patch for handling wrong category for v2 projects' attachments
      // it is happening because we are merging project and product templates for v2 projects and we don't have files
      // field in project templates but we have it for product templates which in turn has category set as `product`
      category = projectLatest.version && projectLatest.version === 'v2' ? 'appDefinition' : category
      category = 'product' === category ? `${category}#${projectLatest.id}` : category
      return (
        <FileListContainer
          additionalClass={additionalClass}
          project={projectLatest}
          files={files}
          category={category}
          addAttachment={addAttachment}
          updateAttachment={updateAttachment}
          removeAttachment={removeAttachment}
          attachmentsStorePath={attachmentsStorePath}
          canManageAttachments={canManageAttachments}
        />
      )
    }
    case 'screens': {
      const screens = _.get(project, props.fieldName, [])
      return (
        <SpecScreens
          additionalClass={additionalClass}
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
      const refCode = _.get(project, refCodeFieldName, '')
      const queryParamRefCode = qs.parse(window.location.search).refCode
      return (
        <div className={cn('project-name-section', { [`${additionalClass}`] : true, 'read-optimized' : isReadOnly} )}>
          <div className="editable-project-name">
            <TCFormFields.TextInput
              name="name"
              placeholder="Project Name"
              value={_.unescape(_.get(project, 'name', ''))}
              wrapperClass="project-name"
              maxLength={ PROJECT_NAME_MAX_LENGTH }
              required={props.required}
              validations={props.required ? 'isRequired' : null}
              validationError={props.validationError}
              theme="paper-form-dotted"
              readonly={isReadOnly}
            />
          </div>
          {isReadOnly && (
            <div className="refcode-read-optimized">{`(Ref Code: ${refCode})`}</div>
          )}
          {!queryParamRefCode && !isReadOnly && (
            <div className="textinput-refcode">
              <TCFormFields.TextInput
                name={refCodeFieldName}
                placeholder="REF code"
                value={ _.unescape(refCode) }
                wrapperClass="project-refcode"
                maxLength={ PROJECT_REF_CODE_MAX_LENGTH }
                theme="paper-form-dotted"
                disabled={ queryParamRefCode && queryParamRefCode.length > 0 }
                readonly={isReadOnly}
              />
              <div className="refcode-desc">
                Optional
              </div>
            </div>
          )}
        </div>
      )
    }
    case 'project-name-advanced': {
      const refCodeFieldName = 'details.utm.code'
      const refCode = _.get(project, refCodeFieldName, '')
      const queryParamRefCode = qs.parse(window.location.search).refCode
      const businessUnitFieldName = 'details.businessUnit'
      const businessUnit = _.get(project, businessUnitFieldName, '')
      const costCentreFieldName = 'details.costCentre'
      const costCentre = _.get(project, costCentreFieldName, '')
      return (
        <div className={'project-name-section ' + additionalClass}>
          <div className="editable-project-name">
            <TCFormFields.TextInput
              name="name"
              placeholder="Project Name"
              value={_.unescape(_.get(project, 'name', ''))}
              wrapperClass="project-name"
              maxLength={ PROJECT_NAME_MAX_LENGTH }
              required={props.required}
              validations={props.required ? 'isRequired' : null}
              validationError={props.validationError}
              theme="paper-form-dotted"
              readonly={_.get(props, '__wizard.readOnly')}
            />
          </div>
          { !queryParamRefCode &&
            <div className="textinput-refcode">
              <TCFormFields.TextInput
                name={refCodeFieldName}
                placeholder="REF code"
                value={ _.unescape(refCode) }
                wrapperClass="project-refcode"
                maxLength={ PROJECT_REF_CODE_MAX_LENGTH }
                theme="paper-form-dotted"
                disabled={ queryParamRefCode && queryParamRefCode.length > 0 }
                readonly={_.get(props, '__wizard.readOnly')}
              />
              {!isReadOnly && (
                <div className="refcode-desc">
                  Optional
                </div>
              )}
            </div>
          }
          <div className="textinput-codes">
            <TCFormFields.TextInput
              name={businessUnitFieldName}
              placeholder="BU"
              value={businessUnit}
              maxLength={ BUSINESS_UNIT_MAX_LENGTH }
              required
              validations= "isRequired"
              validationError="Mandatory field"
              theme="paper-form-dotted"
              wrapperClass="project-codes"
              readonly={_.get(props, '__wizard.readOnly')}
            />
            {!isReadOnly && (
              <div className="codes-desc">
                required
              </div>
            )}
          </div>
          <div className="textinput-codes">
            <TCFormFields.TextInput
              name={costCentreFieldName}
              placeholder="Cost Centre"
              value={costCentre}
              maxLength={ COST_CENTRE_MAX_LENGTH }
              required
              validations= "isRequired"
              validationError="Mandatory field"
              theme="paper-form-dotted"
              wrapperClass="project-codes"
              readonly={_.get(props, '__wizard.readOnly')}
            />
            {!isReadOnly && (
              <div className="codes-desc">
                required
              </div>
            )}
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
        {!project.version === 'v3' &&
        <div className="section-header big-titles">
          <h2 id={id}>
            {title}
          </h2>
          <span className="section-number">{ sectionNumber }</span>
        </div>}
        <p className="gray-text">
          {description}
        </p>
        {subSections.filter((subSection) => (
          // hide if we are in a wizard mode and subSection is hidden for now
          (!_.get(subSection, '__wizard.hidden')) &&
          // hide section marked with hiddenOnCreation during creation process
          (!isCreation || !subSection.hiddenOnCreation) &&
          // hide hidden section, unless we not force to show them
          (showHidden || !subSection.hidden)
        )).map(renderSubSection)}
      </div>
    </div>
  )
}

SpecSection.propTypes = {
  project: PropTypes.object.isRequired,
  productTemplates: PropTypes.array.isRequired,
  sectionNumber: PropTypes.number.isRequired,
  showHidden: PropTypes.bool,
  isCreation: PropTypes.bool,
  addAttachment: PropTypes.func,
  updateAttachment: PropTypes.func,
  removeAttachment: PropTypes.func,
}

export default scrollToAnchors(SpecSection)
