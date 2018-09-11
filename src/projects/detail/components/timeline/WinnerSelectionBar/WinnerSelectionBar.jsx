import React from 'react'
import _ from 'lodash'
import cn from 'classnames'

import SwitchButton from 'appirio-tech-react-components/components/SwitchButton/SwitchButton'

import './WinnerSelectionBar.scss'

class WinnerSelectionBar extends React.Component {
  constructor(props) {
    super(props)

    // create toggle handlers in constructor to avoid recreating functions during render
    this.handlers = props.placesChosen.map((placeChosen, placeIndex) =>
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
      additionalDesignCost,
      placesChosen,
      isSelectedBonus,
      onPlaceChange,
      onBonusChange,
      type,
      selectedPlace,
    } = this.props
    const props = this.props

    const isAllWinnersSelected = _.every(placesChosen, (place) => place > -1)
    const selectedPlaceClassName = selectedPlace <= 3 ? `pos${selectedPlace}` : 'pos-rest'

    return (
      <div
        styleName={cn(
          'winner-bar', {
            selected: !!onPlaceChange && !!selectedPlace || !!onBonusChange && isSelectedBonus,
            'many-places': placesChosen.length > 3,
            'view-only': !onPlaceChange && !onBonusChange,
          }
        )}
      >
        <div styleName="addlink-bar">
          <figure styleName={cn('thumb', type)} />

          <div styleName="group-right">
            <a href={props.link} target="_blank" styleName="label" rel="noopener noreferrer">
              {props.label}
              {!!onBonusChange && isAllWinnersSelected && !selectedPlace && <span styleName="sublable">Purchase for ${additionalDesignCost}</span>}
            </a>
            <a href={props.link} target="_blank" styleName="link" rel="noopener noreferrer">{props.link}</a>
          </div>

          {!!onPlaceChange && (!isAllWinnersSelected || !!selectedPlace) && (
            <div styleName="position">
              {placesChosen.map((placeChosen, placeIndex) => {
                const place = placeIndex + 1
                const posClassName = place <= 3 ? `pos${place}` : 'pos-rest'

                return (
                  <label styleName={'checkbox-ctrl'} key={place}>
                    <input type="checkbox" styleName="checkbox" onChange={this.handlers[placeIndex]} checked={selectedPlace === place} />
                    <span styleName={`checkbox-text ${posClassName} ` + (placeChosen > -1 ? 'inactive' : '' ) }>{place}</span>
                  </label>
                )
              })}
            </div>
          )}

          {!!onBonusChange && isAllWinnersSelected && !selectedPlace && (
            <div styleName="position">
              <div styleName="purchase-for"><span>purchase for ${additionalDesignCost}</span></div>
              <div styleName="switch-button">
                <SwitchButton onChange={this.onBonusChange} />
              </div>
            </div>
          )}

          {!onBonusChange && isSelectedBonus && (
            <div styleName="position">
              <div styleName="purchase-for">+ ${additionalDesignCost}</div>
            </div>
          )}

          {!onPlaceChange && !!selectedPlace && (
            <div styleName="position">
              <label styleName={'checkbox-ctrl'} >
                <span styleName={`checkbox-text active ${selectedPlaceClassName}`}>{selectedPlace}</span>
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
