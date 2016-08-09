import React, { PropTypes } from 'react'

const ListItem = ({ item, columns }) => {

  const renderColumn = (col, index) => {
    const divClasses = `flex-item-title ${col.classes}`
    return (
      <div className={divClasses} key={index}>
          <div className="spacing">
              {col.renderText(item)}
          </div>
      </div>
    )
  }
  return (
    <div className="row">
      <div className="flex-row">
          <div className="mask-layer hide"></div>
          {columns.map(renderColumn)}
      </div>
    </div>
  )
}

ListItem.propTypes = {
  item: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ListItem
