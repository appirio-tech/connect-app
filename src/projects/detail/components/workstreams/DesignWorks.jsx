/**
 * DesignWorks section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import BackIcon from '../../../../assets/icons/arrows-16px-1_tail-left.svg'
import CloseIcon from '../../../../assets/icons/x-mark-black.svg'
import './DesignWork.scss'

class DesignWorks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  /**
   * Get url of dashboard
   */
  getDashboardUrl() {
    const { match } = this.props
    return `/projects/${match.params.projectId}`
  }

  render() {
    const { onBack } = this.props
    return (
      <div styleName="container">
        <div styleName="header">
          <div onClick={onBack} styleName="left-control">
            <i styleName="icon" title="back"><BackIcon /></i>
            <span styleName="back-icon-text">Back</span>
          </div>
          <div styleName="title">ADD DESIGN LINKS</div>
          <div styleName="right-control">
            <i onClick={() => {
              this.props.history.push(this.getDashboardUrl())
              onBack()
            }} styleName="icon-close"
            >
              <CloseIcon />
            </i>
          </div>
        </div>
        <div styleName="complete-wrapper">
          <div styleName="complete-message">Add all the designs for the review. After all the designs are added, click the "Complete" button, so customer may start reviewing them.</div>
          <button styleName="complete-btn" className="tc-btn tc-btn-warning tc-btn-sm action-btn " onClick={() => {}}>Complete</button>
        </div>
        <div styleName="add-design-option-wrapper">
          <button styleName="add-design-option-btn" className="tc-btn tc-btn-primary tc-btn-sm action-btn " onClick={() => {}}>Add design option</button>
        </div>
      </div>
    )
  }
}

DesignWorks.defaultProps = {
  onBack: () => {},
}

DesignWorks.propTypes = {
  onBack: PT.func
}

export default withRouter(DesignWorks)
