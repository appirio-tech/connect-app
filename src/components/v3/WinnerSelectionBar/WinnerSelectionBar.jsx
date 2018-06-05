import React from 'react'
import PT from 'prop-types'
import './WinnerSelectionBar.scss'
import SwitchButton from 'appirio-tech-react-components/components/SwitchButton/SwitchButton'

class WinnerSelectionBar extends React.Component {
  constructor(props) {
    super(props)

    this.toggleSelected = this.toggleSelected.bind(this)
    this.toggleSelected2nd = this.toggleSelected2nd.bind(this)
    this.toggleSelected3rd = this.toggleSelected3rd.bind(this)
    this.toggleSelectedBonus = this.toggleSelectedBonus.bind(this)
    this.shouldHideCheckbox = this.shouldHideCheckbox.bind(this)
    this.isWinTop3Prize = this.isWinTop3Prize.bind(this)
    
    this.state = {
      isSelected: false,
      checkBox1: {},
      checkBox2: {},
      checkBox3: {},

    }
  }

  componentDidMount() {
    this.setState({
      isSelected: !!this.props.isSelected
    })
  }

  toggleSelected(e) {
    const isChecked = e.target.checked
    this.setState({
      isSelected: isChecked,
      checkBox1: e.target
    })
    this.props.checkActionHandler(1, isChecked, this.props.index)
  }

  toggleSelected2nd(e) {
    const isChecked = e.target.checked
    this.setState({
      isSelected: isChecked,
      checkBox2: e.target
    })
    this.props.checkActionHandler(2, isChecked, this.props.index)
  }

  toggleSelected3rd(e) {
    const isChecked = e.target.checked
    this.setState({
      isSelected: isChecked,
      checkBox3: e.target
    })
    this.props.checkActionHandler(3, isChecked, this.props.index)
  }

  toggleSelectedBonus(e) {
    const isChecked = e.target.checked
    this.props.checkBonusActionHandler(isChecked, this.props.index)
  }

  isSelected() {
    if (this.state.checkBox1 && this.state.checkBox2 && this.state.checkBox3) {
      return (this.state.checkBox1.checked || this.state.checkBox2.checked || this.state.checkBox3.checked)
    }
    return false
  } 

  shouldHideCheckbox() {
    const props = this.props
    return ((props.postionIndex[0] > -1) && !this.isSelected()) && ((props.postionIndex[1] > -1) && !this.isSelected()) && ((props.postionIndex[2] > -1) && !this.isSelected())
  }

  isWinTop3Prize() {
    const props = this.props
    return props.index < 3
  }

  render() {
    const props = this.props

    return (
      <div styleName={'winner-bar '
        + (this.state.isSelected && !props.isReadonly ? 'selected ' : '')
        + (props.isCompleted ? ' completed ' : '')
        + (props.inProgress ? 'in-progress' : '')
      }
      >
        <div styleName="add-specification-layer addlink-bar" className="flex space-between middle">
          <figure styleName={'thumb ' + (props.icon ? props.icon : '')} />
          <div className="group-right">
            <span styleName="label">{props.label}</span>
            <a href={props.link} target="_blank" styleName="link">{props.link}</a>
          </div>
          {
            (!this.shouldHideCheckbox() || !props.isSelected3TopWin) && !props.isReviewed && (
              <div styleName="position">
                <label styleName={'checkbox-ctrl'} >
                  <input type="radio" styleName="checkbox" name="pos1" onChange={this.toggleSelected} /> 
                  <span styleName={'checkbox-text pos1 ' + (this.props.postionIndex[0] > -1 ? 'inactive' : '' ) }>1</span>
                </label>
                <label styleName={'checkbox-ctrl'} >
                  <input type="radio" styleName="checkbox" name="pos2" onChange={this.toggleSelected2nd} /> 
                  <span styleName={'checkbox-text pos2 ' + (this.props.postionIndex[1] > -1 ? 'inactive' : '' ) }>2</span>
                </label>
                <label styleName={'checkbox-ctrl'} >
                  <input type="radio" styleName="checkbox" name="pos3" onChange={this.toggleSelected3rd} /> 
                  <span styleName={'checkbox-text pos3 ' + (this.props.postionIndex[2] > -1 ? 'inactive' : '' ) }>3</span>
                </label>
              </div>
            )
          }
          {
            this.shouldHideCheckbox() && props.isSelected3TopWin && (
              <div styleName="position">
                <div styleName="purchase-for">purchase for $100</div>
                <div styleName="switch-button">
                  <SwitchButton onChange={ this.toggleSelectedBonus }/>
                </div>
              </div>
            )
          }
          {
            this.shouldHideCheckbox() && props.isReviewed && !this.isWinTop3Prize() && (
              <div styleName="position">
                <div styleName="purchase-for">+ $100</div>
              </div>
            )
          }
          {
            props.isReviewed && this.isWinTop3Prize() && (
              <div styleName="position">
                {
                  props.index === 0 && (
                    <label styleName={'checkbox-ctrl'} >
                      <input type="radio" styleName="checkbox" name="pos1" checked /> 
                      <span styleName={'checkbox-text pos1'}>1</span>
                    </label>
                  )
                }
                {
                  props.index === 1 && (
                    <label styleName={'checkbox-ctrl'} >
                      <input type="radio" styleName="checkbox" name="pos2" checked /> 
                      <span styleName={'checkbox-text pos2'}>2</span>
                    </label>
                  )
                }
                {
                  props.index === 2 && (
                    <label styleName={'checkbox-ctrl'} >
                      <input type="radio" styleName="checkbox" name="pos3" checked /> 
                      <span styleName={'checkbox-text pos3'}>3</span>
                    </label>
                  )
                }
              </div>
            )
          }
          
          {
            props.isReadonly && this.props.isSelected && (
              <span styleName="item-checked" />
            )
          }

        </div>
      </div>
    )
  }
}

WinnerSelectionBar.defaultProps = {
  isReviewed: false,
  isSelected: false,
  isSelected3TopWin: false
}

WinnerSelectionBar.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool,
  isSelected: PT.bool,
  isReadonly: PT.bool,
  isReviewed: PT.bool,
  isSelected3TopWin: PT.bool
}

export default WinnerSelectionBar
