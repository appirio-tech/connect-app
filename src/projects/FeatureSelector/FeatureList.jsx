import React, { Component } from 'react'
import { Link } from 'react-router'
import classNames from 'classnames'
import FeatureSelectorNav from './FeatureSelectorNav'

require('./FeatureList.scss')

class FeatureList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { headerText, icon, features, activeFeature, onFeatureSelection } = this.props
    const renderFeature = (feature, idx) => {
      const featureClasses = classNames('feature-list-feature', {
        'active-feature' : activeFeature && activeFeature.title == feature.title //TODO id comparison
      })
      const activateFeature = () => {
        if (onFeatureSelection && typeof onFeatureSelection === 'function') {
          onFeatureSelection(feature)
        }
      }
      const selectedClasses = classNames({
        invisible: !feature.selected
      })
      return (
        <li key={ idx } className={featureClasses}>
          <button onClick={ activateFeature } className="clean">
            <div className="flex">
              <img className={ selectedClasses } src={ require("./images/icon-check-solid.svg") } />
              <p>{ feature.title }</p>
            </div>
          </button>
        </li>
      )
    }
    return (
      <div className="feature-list">
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