import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'

import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields

import styles from './MilestonePostEditDate.scss'

const MilestonePostEditDate = ({ startDate, endDate, theme }) => {
  const startDateProps = _.omit(startDate, 'label')
  startDateProps.type = 'date'
  startDateProps.wrapperClass = styles['field-wrapper']

  const endDateProps = _.omit(endDate, 'label')
  endDateProps.type = 'date'
  endDateProps.wrapperClass = styles['field-wrapper']

  return (
    <div styleName={cn('milestone-post', theme)}>
      <div styleName="col-left">
        <label styleName="label-title">{startDate.label}</label>
      </div>
      <div styleName="col-right">
        <TCFormFields.TextInput {...startDateProps} />
        <label styleName="label-title">{endDate.label}</label>
        <TCFormFields.TextInput {...endDateProps} />
      </div>
    </div>
  )
}

MilestonePostEditDate.defaultProps = {
  theme: '',
}

MilestonePostEditDate.propTypes = {
  theme: PT.string,
}

export default MilestonePostEditDate
