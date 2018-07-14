import React from 'react'
import PT from 'prop-types'
import './MilestonePostSpecification.scss'
/**this is cell for specification form */
class MilestonePostSpecification extends React.Component {
  constructor(props) {
    super(props)
    this.buttonClick = this.buttonClick.bind(this)
    this.state = {
      isSpecificationLinkAdded: false
    }
  }

  buttonClick() {
    this.props.onClick()
  }

  render() {
    const props = this.props

    return (
      <div styleName={'milestone-post-specification '
        + (props.theme ? props.theme : '')
        + (props.isCompleted ? ' completed ' : '')
        + (props.inProgress ? 'in-progress' : '')
      }
      >
        <div styleName="add-specification-layer addlink-bar" className="flex center middle">
          <figure styleName={'thumb ' + (props.icon ? props.icon : '')} />
          {
            props.fakeName !== '' && (
              <div styleName="fake-name">{props.fakeName}</div>
            )
          }
          <button className="tc-btn tc-btn-default"
            onClick={this.buttonClick}
          ><strong>{props.label}</strong></button>
        </div>
      </div>
    )
  }
}

MilestonePostSpecification.defaultProps = {
  fakeName: '',
  onClick: () => {},
  isCompleted: false,
  inProgress: false
}

MilestonePostSpecification.propTypes = {
  fakeName: PT.string,
  onClick: PT.func,
  isCompleted: PT.bool,
  inProgress: PT.bool
}

export default MilestonePostSpecification
