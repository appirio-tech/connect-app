import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import './MilestonePostMessage.scss'

class MilestonePostMessage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      selectionValue: null,
    }

    this.onSelectionChange = this.onSelectionChange.bind(this)
    this.warningCallBack = this.warningCallBack.bind(this)
  }

  onSelectionChange(evt) {
    const value = evt.target.value

    this.setState({ selectionValue: value })
  }

  warningCallBack() {
    const { warningCallBack } = this.props

    warningCallBack(this.state.selectionValue)
  }

  render() {
    const { buttons } = this.props
    const { selectionValue } = this.state
    const props = this.props

    return (
      <div
        styleName={cn('milestone-post', props.theme, {
          completed: props.isCompleted,
          'in-progress': props.inProgress,
        })}
      >
        <div styleName="label-layer">
          <div styleName="label-title">{props.label}</div>
          <div styleName="group-content" dangerouslySetInnerHTML={{ __html: props.message }} />
          {
            props.isShowSelection && (
              <div styleName="group-selection">
                <div>{'Extension to request:'}</div>
                <label styleName="label">
                  <input type="radio" name="pos1" value="1" onChange={this.onSelectionChange} />
                  <div>1 day</div>
                </label>
                <label styleName="label">
                  <input type="radio" name="pos1" value="2" onChange={this.onSelectionChange} />
                  <div>2 days</div>
                </label>
                <label styleName="label">
                  <input type="radio" name="pos1" value="3" onChange={this.onSelectionChange} />
                  <div>3 days</div>
                </label>
              </div>
            )
          }
          {buttons.length > 0 && (
            <div styleName="group-button">
              {buttons.map((button) => (
                <button
                  key={button.title}
                  onClick={() => button.onClick(selectionValue)}
                  className={`tc-btn tc-btn-${button.type || 'default'}`}
                >
                  {button.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
}

MilestonePostMessage.defaultProps = {
  isCompleted: false,
  inProgress: true,
  labelStatus: '',
  backgroundColor: '#FAFAFB',
  cancelCallback: () => {},
  okCallback: () => {},
  warningCallBack: () => {},
  theme: 'primary',
  button1Title: '',
  button2Title: '',
  button3Title: '',
  isShowSelection: false,
  message: '',
  label: ''

}

MilestonePostMessage.propTypes = {
  isCompleted: PT.bool,
  inProgress: PT.bool,
  labelStatus: PT.string,
  backgroundColor: PT.string,
  cancelCallback: PT.func,
  okCallback: PT.func,
  warningCallBack: PT.func,
  theme: PT.string,
  button1Title: PT.string,
  button2Title: PT.string,
  button4Title: PT.string,
  isShowSelection: PT.bool,
  message: PT.string,
  label: PT.string
}

export default MilestonePostMessage
