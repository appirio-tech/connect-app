import React from 'react'
import _ from 'lodash'
import cn from 'classnames'

import SwitchButton from 'appirio-tech-react-components/components/SwitchButton/SwitchButton'

import './WinnerSelectionBar.scss'

class WinnerSelectionBar extends React.Component {
  constructor(props) {
    super(props)

    this.toggleSelected1st = this.toggleSelected1st.bind(this)
    this.toggleSelected2nd = this.toggleSelected2nd.bind(this)
    this.toggleSelected3rd = this.toggleSelected3rd.bind(this)
    this.onBonusChange = this.onBonusChange.bind(this)
  }

  toggleSelected1st(evt) {
    const isChecked = evt.target.checked
    const { onPlaceChange, index } = this.props

    onPlaceChange(index, 1, isChecked)
  }

  toggleSelected2nd(evt) {
    const isChecked = evt.target.checked
    const { onPlaceChange, index } = this.props

    onPlaceChange(index, 2, isChecked)
  }

  toggleSelected3rd(evt) {
    const isChecked = evt.target.checked
    const { onPlaceChange, index } = this.props

    onPlaceChange(index, 3, isChecked)
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
                <label styleName={'checkbox-ctrl'} >
                  <input type="checkbox" styleName="checkbox" onChange={this[`toggleSelected${place}st`]} checked={selectedPlace === place} />
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
