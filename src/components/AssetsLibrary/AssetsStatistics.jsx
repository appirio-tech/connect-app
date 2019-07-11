import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'

import './AssetsStatistics.scss'

class AssetsStatistics extends React.Component {

  render() {
    const {assetsData, onClickAction, activeAssetsType} = this.props

    return (
      <div styleName="assets-statistics-container">
        <ul styleName="assets-statistics">
          {
            assetsData.map((asset) => {
              const activeClass = cn({
                active: asset.name === activeAssetsType
              })
              return (<li key={asset.name} styleName={activeClass} onClick={() => onClickAction(asset.name)}>
                <span styleName="name">{asset.name}</span>
                <span styleName="total">{asset.total}</span>
              </li>)
            })
          }
        </ul>
      </div>
    )
  }
}


AssetsStatistics.propTypes = {
  assetsData: PropTypes.arrayOf(PropTypes.shape({
    name:  PropTypes.string.isRequired,
    total: PropTypes.string.isRequired
  })).isRequired,
  onClickAction: PropTypes.func.isRequired,
  activeAssetsType: PropTypes.string.isRequired,
}
export default AssetsStatistics
