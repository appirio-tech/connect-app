import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import SelectDropdown from '../../../../../components/SelectDropdown/SelectDropdown'

import './MilestonePostEditLinkDropDown.scss'

const MilestonePostEditLinkDropDown = ({ name, value, options, label, theme }) => (
  <div styleName={cn('milestone-post', theme)}>
    <div styleName="col-left">
      <div styleName="label-title">{label}</div>
    </div>
    <div styleName="col-right">
      <SelectDropdown
        name={name}
        value={value}
        theme="default"
        options={options}
      />
    </div>
  </div>
)

MilestonePostEditLinkDropDown.defaultProps = {
  theme: '',
}

MilestonePostEditLinkDropDown.propTypes = {
  theme: PT.string,
}

export default MilestonePostEditLinkDropDown
