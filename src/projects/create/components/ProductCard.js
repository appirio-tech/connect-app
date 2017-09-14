import _ from 'lodash'
import React, { PropTypes as PT } from 'react'
import './ProductCard.scss'

class ProductCard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const p = this.props
    const s = this.state
    const icon = React.cloneElement(p.icon, {
      color: !p.disabled && s.hovered ? 'blue' : 'black'
    })
    return (
      <div
        className={`ProductCard ${p.disabled ? 'disabled' : 'enabled'}`}
        onClick={p.disabled ? _.noop : p.onClick}
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
      >
        {icon}
        <h3 className="header">{p.type}</h3>
        <div className="details">{p.info}</div>
      </div>
    )
  }
}

ProductCard.defaultTypes = {
  onClick: _.noop
}

ProductCard.propTypes = {
  icon: PT.element.isRequired,
  info: PT.string.isRequired,
  onClick: PT.func,
  type: PT.string.isRequired
}

export default ProductCard
