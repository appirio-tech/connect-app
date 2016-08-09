import React, { PropTypes } from 'react'

const ListHeader = ({ headers/*, sortHandler, currentSortFields*/ }) => {

  const renderColumn = (col, index) => {
    const divClasses = `flex-item-title ${col.classes}`
    // TODO handle sorting
    const sortClasses = 'sort-txt'
    return (
      <div className={divClasses} key={index}>
        <div className="spacing">
          <a className={sortClasses}>
            {col.headerLabel}
          </a>
        </div>
      </div>
    )
  }
  return (
    <div className="row">
      <div className="flex-row row-th">
        <div className="mask-layer hide"></div>
        { headers.map(renderColumn)}
      </div>
    </div>
  )
}

ListHeader.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortHandler: PropTypes.func,
  currentSortFields: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default ListHeader
