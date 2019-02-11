import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import cn from 'classnames'
import Down from '../../assets/icons/arrow-down-big.svg'
import Up from '../../assets/icons/arrow-up-big.svg'


const HeaderItem = ({item, onItemClick, currentSortField}) => {
  const _onClick = () => onItemClick(item.id)
  const divClasses = `flex-item-title ${item.classes}`
  const desc = currentSortField.indexOf(`${item.id} desc`) > -1
  const sortClasses = cn('sort-txt', {
    'icon-down': desc,
    'icon-up': !desc
  })
  return (
    <div className={divClasses}>
      <div className="spacing">
        { item.sortable ?
          <a href="javascript:" className={sortClasses} onClick={_onClick}>
            { !desc && <Up className={sortClasses}/> }
            { !!desc && <Down className={sortClasses}/> }
            {item.headerLabel}
          </a>
          : item.headerLabel
        }
      </div>
    </div>
  )
}


const ListHeader = ({ columns, sortHandler, currentSortField }) => {

  const toggleSort = (fieldName) => {
    const f = _.find(columns, h => h.id === fieldName)
    if (f && f.sortable) {
      let newSortField = fieldName
      if (currentSortField.split(' ')[0] === fieldName) {
        // toggle the order of the sort for the same  field
        newSortField = currentSortField.indexOf('desc') > -1 ? fieldName : fieldName + ' desc'
      }
      sortHandler(newSortField)
    }
  }

  return (
    <div className="row header">
      <div className="flex-row row-th">
        <div className="mask-layer hide" />
        { columns.map( col =>
          <HeaderItem key={col.id} item={col} currentSortField={currentSortField} onItemClick={toggleSort} />
        )}
      </div>
    </div>
  )
}

ListHeader.propTypes = {
  /**
   * an array of objects that contain header label, css classes & a field id
   */
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  /**
   * Function that handles sorting result sets.
   */
  sortHandler: PropTypes.func,
  /**
   * Current sort field, used to set appropriate css classes on the column
   */
  currentSortField: PropTypes.string.isRequired
}

export default ListHeader
