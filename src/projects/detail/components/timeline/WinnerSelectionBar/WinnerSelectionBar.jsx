import React from 'react'
import _ from 'lodash'
import cn from 'classnames'

import SwitchButton from 'appirio-tech-react-components/components/SwitchButton/SwitchButton'

import './WinnerSelectionBar.scss'

class WinnerSelectionBar extends React.Component {
  constructor(props) {
    super(props)

    // create toggle handlers in constructor to avoid recreating functions during render
    this.handlers = [0, 1, 2].map((placeIndex) =>
      this.toggleSelected.bind(this, placeIndex + 1)
    )
    this.onBonusChange = this.onBonusChange.bind(this)
  }

  toggleSelected(place, evt) {
    const isChecked = evt.target.checked
    const { onPlaceChange, index } = this.props

    onPlaceChange(index, place, isChecked)

    const { onBonusChange, isSelectedBonus } =  this.props
    // if we select place and bonus was previously selected, then unselect bonus
    if (isChecked && isSelectedBonus) {
      onBonusChange(index, false)
    }
  }

  onBonusChange(evt) {
    const isSelected = evt.target.checked
    const { onBonusChange, index } =  this.props

    onBonusChange(index, isSelected)
  }

  render() {
    const {
      placesChosen,
      isSelectedBonus,
      onPlaceChange,
      onBonusChange,
      type,
      selectedPlace,
      maxPlace,
    } = this.props
    const props = this.props

    const isSelected3TopWin = _.every(placesChosen, (place) => place > -1)

    return (
      <div styleName={cn('winner-bar', { selected: !!selectedPlace || isSelectedBonus })}>
        <div
          styleName="add-specification-layer addlink-bar"
          className="flex space-between middle"
        >
          <figure styleName={cn('thumb', type)} />

          <div className="group-right">
            <span styleName="label">{props.label}</span>
            <a href={props.link} target="_blank" styleName="link" rel="noopener noreferrer">{props.link}</a>
          </div>

          {!!onPlaceChange && (!isSelected3TopWin || !!selectedPlace) && (
            <div styleName="position">
              {[1, 2, 3].filter((place) => place <= maxPlace).map((place) => (
                <label styleName={'checkbox-ctrl'} key={place}>
                  <input type="checkbox" styleName="checkbox" onChange={this.handlers[place -1]} checked={selectedPlace === place} />
                  <span styleName={`checkbox-text pos${place} ` + (placesChosen[place - 1] > -1 ? 'inactive' : '' ) }>{place}</span>
                </label>
              ))}
            </div>
          )}

          {!!onBonusChange && isSelected3TopWin && !selectedPlace && (
            <div styleName="position">
              <div styleName="purchase-for">purchase for $100</div>
              <div styleName="switch-button">
                <SwitchButton onChange={this.onBonusChange} />
              </div>
            </div>
          )}

          {!onBonusChange && isSelectedBonus && (
            <div styleName="position">
              <div styleName="purchase-for">+ $100</div>
            </div>
          )}

          {!onPlaceChange && !!selectedPlace && (
            <div styleName="position">
              <label styleName={'checkbox-ctrl'} >
                <span styleName={`checkbox-text active pos${selectedPlace}`}>{selectedPlace}</span>
              </label>
            </div>
          )}
        </div>
      </div>
    )
  }
}

WinnerSelectionBar.defaultProps = {
}

WinnerSelectionBar.propTypes = {

}

export default WinnerSelectionBar
