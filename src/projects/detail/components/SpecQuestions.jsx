import React, { PropTypes } from 'react'
import seeAttachedWrapperField from './SeeAttachedWrapperField'
import { TCFormFields } from 'appirio-tech-react-components'
import _ from 'lodash'

import FeatureList from '../../../components/FeatureList/FeatureList'
import FeatureIcons from '../../../components/FeatureList/FeatureIcons'

// HOC for TextareaInput
const SeeAttachedTextareaInput = seeAttachedWrapperField(TCFormFields.Textarea)

const getIcon = icon => {
  switch (icon) {
  case 'feature-generic':
    return <FeatureIcons.Generic />
  case 'feature-placeholder':
  default:
    return <FeatureIcons.Placeholder />
  }
}

const SpecQuestions = ({questions, project, showFeaturesDialog}) => {

  const renderQ = (q, index) => {
    let child = null
    const value = _.get(project, q.fieldName, undefined)
    switch (q.type) {
    case 'see-attached-textbox':
      child = <SeeAttachedTextareaInput name={q.fieldName} label={q.label} value={value} wrapperClass="row" />
      break
    case 'textinput':
      child = <TCFormFields.TextInput name={q.fieldName} label={q.label} value={value} wrapperClass="row" />
      break
    case 'textbox':
      child = <TCFormFields.Textarea name={q.fieldName} label={q.label} value={value} wrapperClass="row" />
      break
    case 'radio-group':
      child = <TCFormFields.RadioGroup name={q.fieldName} label={q.label} value={value} wrapperClass="row" options={q.options} />
      break
    case 'checkbox-group':
      child = <TCFormFields.CheckboxGroup name={q.fieldName} label={q.label} value={value} options={q.options} />
      break
    case 'checkbox':
      child = <TCFormFields.Checkbox name={q.fieldName} label={q.label} value={value} />
      break
    case 'features':
      child = (
        <div className="add-edit-features">
          <div className="add-edit-features__header">
            <button type="button" onClick={ showFeaturesDialog } className="tc-btn-default tc-btn-sm">Add / Edit features</button>
          </div>
          <div className="add-edit-features__added-features">
            <FeatureList>
              {_.get(project, q.fieldName, []).map(
                (f, idx) => <FeatureList.Item key={idx} icon={ <img src={f.icon} /> } title={ f.title } description={ f.description }  />
              )}
            </FeatureList>
          </div>
        </div>
      )
      break
    default:
      child = <noscript />
    }
    return (
      <FeatureList.Item
        key={index}
        title={q.title}
        icon={getIcon(q.icon)}
        description={q.description}
      >
        {child}
      </FeatureList.Item>
    )
  }

  return (
    <FeatureList>
      {questions.map(renderQ)}
    </FeatureList>
  )
}

SpecQuestions.propTypes = {
  project: PropTypes.object.isRequired,
  questions: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default SpecQuestions
