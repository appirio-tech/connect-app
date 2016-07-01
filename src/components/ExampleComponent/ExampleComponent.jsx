// Use imports over requires (except scss)
import React, { PropTypes } from 'react'
import classNames from 'classnames'

// Require local scss file
require('./ExampleComponent.scss')

// Destructure values from props to create variable names when helpful
//   props = {
//     items: [...]
//   }
export default function ExampleComponent({ items }) {
  const row = (item, index) => {
    // Use the classnames module for dynamic class names
    const itemClassnames = classNames(
      { [`${item.name}-color`]: item.isFeatured },
      { 'on-sale': item.onSale}
    )

    return (
      <li className={itemClassnames} key={index}>
        {item.name}
      </li>
    )
  }

  return (
    <ul className="item-list">
      { items.map(row) }
    </ul>
  )
}

// Always add PropTypes for all props values
// Mark required props with isRequired
ExampleComponent.propTypes = {
  items: PropTypes.array.isRequired
}
