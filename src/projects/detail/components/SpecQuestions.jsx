import React, { PropTypes } from 'react'
import seeAttachedWrapperField from './SeeAttachedWrapperField'
import { TCFormFields } from 'appirio-tech-react-components'
import _ from 'lodash'

import SpecQuestionList from './SpecQuestionList/SpecQuestionList'
import SpecQuestionIcons from './SpecQuestionList/SpecQuestionIcons'
import SpecFeatureQuestion from './SpecFeatureQuestion'
import ColorSelector from './../../../components/ColorSelector/ColorSelector'

// HOC for TextareaInput
const SeeAttachedTextareaInput = seeAttachedWrapperField(TCFormFields.Textarea)

// HOC for SpecFeatureQuestion
const SeeAttachedSpecFeatureQuestion = seeAttachedWrapperField(SpecFeatureQuestion)

const getIcon = icon => {
  switch (icon) {
  case 'feature-generic':
    return <SpecQuestionIcons.Generic />
  case 'question':
    return <SpecQuestionIcons.Question />
  case 'feature-placeholder':
  default:
    return <SpecQuestionIcons.Placeholder />
  }
}

const SpecQuestions = ({questions, project, resetFeatures, showFeaturesDialog}) => {

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
    case 'tiled-radio-group':
      child = <TCFormFields.TiledRadioGroup name={q.fieldName} label={q.label} value={value} wrapperClass="row" options={q.options} />
      break
    case 'checkbox-group':
      child = <TCFormFields.CheckboxGroup name={q.fieldName} label={q.label} value={value} options={q.options} />
      break
    case 'checkbox':
      child = <TCFormFields.Checkbox name={q.fieldName} label={q.label} value={value} />
      break
    case 'features':
      child = <SeeAttachedSpecFeatureQuestion name={q.fieldName} value={value} question={ q } resetValue={ resetFeatures } showFeaturesDialog={ showFeaturesDialog } />
      break
    case 'colors':
      child = <ColorSelector name={q.fieldName} defaultColors={q.defaultColors} value={value} />
      break
    default:
      child = <noscript />
    }
    return (
      <SpecQuestionList.Item
        key={index}
        title={q.title}
        icon={getIcon(q.icon)}
        description={q.description}
      >
        {child}
      </SpecQuestionList.Item>
    )
  }

  return (
    <SpecQuestionList>
      {questions.map(renderQ)}
    </SpecQuestionList>
  )
}

SpecQuestions.propTypes = {
  project: PropTypes.object.isRequired,
  showFeaturesDialog: PropTypes.func.isRequired,
  resetFeatures: PropTypes.func.isRequired,
  questions: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default SpecQuestions
