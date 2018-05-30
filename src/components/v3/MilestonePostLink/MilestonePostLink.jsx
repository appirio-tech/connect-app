import React from 'react'
import PT from 'prop-types'
import './MilestonePostLink.scss'

class MilestonePostLink extends React.Component {
  constructor(props) {
    super(props)

    this.toggleSelected = this.toggleSelected.bind(this)

    this.state = {
      isSelected: false
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
      isSelected: isChecked
    })
    this.props.checkActionHandler(isChecked, this.props.index)
  }

  render() {
    const props = this.props

    return (
      <div styleName={'milestone-post-specification '
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
            !props.isReadonly && (
              <label styleName="checkbox-ctrl">
                <input type="checkbox" styleName="checkbox" onChange={this.toggleSelected} /> <span styleName="checkbox-text" />
              </label>
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

MilestonePostLink.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool,
  isSelected: PT.bool,
  isReadonly: PT.bool
}

export default MilestonePostLink
