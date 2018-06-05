import React from 'react'
import PT from 'prop-types'
import './MilestonePostMessage.scss'



const MilestonePostMessage = (props) => {
  const milestonePostStyle = {
    backgroundColor: `${props.backgroundColor}`
  }
  return (
    <div style={milestonePostStyle} styleName={'milestone-post ' 
    + (props.theme ? props.theme : '')
    + (props.isCompleted ? 'completed ' : '')
    + (props.inProgress ? 'in-progress ' : '')
    }
    >
      <div styleName="label-layer">
        <div styleName="label-title">{props.label}</div>
        <div styleName="group-content" dangerouslySetInnerHTML={{ __html: props.message }} />
        {
          props.isShowSelection && (
            <div styleName="group-selection">
              <div>{'Extension to request:'}</div>
              <label styleName="label">
                <input type="radio" name="pos1"/> 
                <div>1 day</div>
              </label>
              <label styleName="label">
                <input type="radio" name="pos1"/> 
                <div>2 days</div>
              </label>
              <label styleName="label">
                <input type="radio" name="pos1"/> 
                <div>3 days</div>
              </label>
            </div>
          )
        }
        {
          (props.button1Title || props.button2Title || props.button3Title) && (
            <div styleName="group-button">
              {
                props.button1Title && (
                  <button onClick={props.cancelCallback} className="tc-btn tc-btn-default"><strong>{props.button1Title}</strong></button>
                )
              }
              {
                props.button2Title && (
                  <button onClick={props.warningCallBack} className="tc-btn tc-btn-warning"><strong>{props.button2Title}</strong></button>
                )
              }
              {
                props.button3Title && (
                  <button onClick={props.okCallback} className="tc-btn tc-btn-primary"><strong>{props.button3Title}</strong></button>
                )
              }
            </div>
          )
        }
      </div>
    </div>
  )
}

MilestonePostMessage.defaultProps = {
  isCompleted: false,
  inProgress: true,
  labelStatus: '',
  backgroundColor: '#FAFAFB',
  cancelCallback: () => {},
  okCallback: () => {},
  warningCallBack: () => {},
  theme: '',
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
