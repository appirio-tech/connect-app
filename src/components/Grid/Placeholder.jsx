import React, { PropTypes } from 'react'
import './Placeholder.scss'

const Placeholder = ({ columns }) => {

  const renderColumn = (col, index) => {
    const divClasses = `flex-item-title ${col.classes} placeholder-parent`
    return (
      <div className={divClasses} key={index}>
        <div className="placeholder" />
      </div>
    )
  }

  return (
    <div className="row">
      <div className="flex-row">
          {columns.map(renderColumn)}
      </div>
    </div>
  )
}

Placeholder.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default Placeholder
