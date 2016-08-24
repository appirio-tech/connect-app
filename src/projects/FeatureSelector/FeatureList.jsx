import React, { Component } from 'react'
import classNames from 'classnames'

require('./FeatureList.scss')

class FeatureList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { headerText, icon, features, activeFeature, onFeatureSelection } = this.props
    const renderFeature = (feature, idx) => {
      const featureClasses = classNames('feature-list-feature', {
        'active-feature' : activeFeature && activeFeature.id === feature.id,
        'selected-feature' : feature.selected
      })
      const activateFeature = () => {
        if (onFeatureSelection && typeof onFeatureSelection === 'function') {
          onFeatureSelection(feature)
        }
      }
      return (
        <li key={ idx } className={featureClasses}>
          <button onClick={ activateFeature } className="clean">
            <div className="flex">
              <img className="selected-feature-icon" src={ require('./images/icon-check-solid.svg') } />
              <p>{ feature.title }</p>
            </div>
          </button>
        </li>
      )
    }
    return (
      <div className="feature-picker-feature-list">
        <header className="flex middle">
          <img src={ icon } />
          <h6>{ headerText }</h6>
        </header>
        <ul>
          { features.map(renderFeature) }
        </ul>
      </div>
    )
  }
}

export default FeatureList
