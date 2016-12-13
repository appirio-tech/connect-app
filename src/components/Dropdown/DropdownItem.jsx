import React, { PropTypes } from 'react'
import cn from 'classnames'

const DropdownItem = ({item, onItemClick, currentSelection}) => {
  const _onClick = () => onItemClick(item.val)
  const activeClass = cn({
    active: item.val === currentSelection
  })
  return (
    <li onClick={_onClick} className={activeClass}>
      <a href="javascript:">{ item.label }</a>
    </li>
  )
}

DropdownItem.propTypes = {
  // item must have at least these 2 properties
  item: PropTypes.shape({
    // label that is displayed in the dropdown
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.element
    ]).isRequired,
    // value to be provided when item is clicked
    val: PropTypes.any.isRequired
  }).isRequired,
  // function to be invoked when an item is clicked
  onItemClick: PropTypes.func.isRequired,
  // current selection used to set active class
  currentSelection: PropTypes.any
}

export default DropdownItem
