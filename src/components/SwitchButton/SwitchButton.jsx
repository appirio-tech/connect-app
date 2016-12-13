import React from 'react'
require('./SwitchButton.scss')
const SwitchButton = ({label, ...props}) => {
  return (
    <div className="SwitchButton clearfix">
      <label>
        <span className="label">{label}</span>
        <input type="checkbox" {...props} />
        <i/>
      </label>
    </div>
  )
}

export default SwitchButton
