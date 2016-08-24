import React, { PropTypes } from 'react'
import seeAttachedWrapperField from './SeeAttachedWrapperField'
import { TCFormFields } from 'appirio-tech-react-components'

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

const SpecQuestions = ({questions}) => {

  const renderQ = (q, index) => {
    let child = null
    switch (q.type) {
    case 'see-attached-textbox':
      child = <SeeAttachedTextareaInput name={q.fieldName} label={q.label} wrapperClass="row" />
      break
    case 'textbox':
      child = <TCFormFields.Textarea name={q.fieldName} label={q.label} wrapperClass="row" />
      break
    case 'radio-group':
      child = <TCFormFields.RadioGroup name={q.fieldName} label={q.label} wrapperClass="row" options={q.options} />
      break
    case 'checkbox-group':
      child = <TCFormFields.CheckboxGroup name={q.fieldName} label={q.label} options={q.options} />
      break
    case 'checkbox':
      child = <TCFormFields.Checkbox name={q.fieldName} label={q.label} />
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
  questions: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default SpecQuestions
