import React, { Component } from 'react'
import { Icons } from 'appirio-tech-react-components'
import classNames from 'classnames'
import _ from 'lodash'
require('./PickerFeatureList.scss')

class PickerFeatureList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { headerText, icon, features, selectedFeatureId, activeFeatureIdList, onSelectFeature } = this.props
    const renderFeature = (feature, idx) => {
      const isActive = _.indexOf(activeFeatureIdList, feature.id) > -1
      const featureClasses = classNames('feature-list-feature', {
        'active-feature' : isActive,
        'selected-feature' : feature.id === selectedFeatureId
      })
      const onClick = () => {
        if (feature.id !== selectedFeatureId)
          onSelectFeature(feature.id)
      }
      return (
        <li key={ idx } className={featureClasses}>
          <a onClick={ onClick } className="clean">
            <div className="flex">
              <span>{ feature.title }</span>
              <span>{ isActive && <Icons.IconUICheckBold fill={'#FB7D22'} />}</span>
            </div>
          </a>
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


PickerFeatureList.PropTypes = {}
export default PickerFeatureList
