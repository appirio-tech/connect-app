import React from 'react'
import PT from 'prop-types'
import './WinnerSelection.scss'
import WinnerSelectionBar from '../WinnerSelectionBar'

class WinnerSelection extends React.Component {
  constructor(props) {
    super(props)

    this.checkActionHandler = this.checkActionHandler.bind(this)
    this.completeReview = this.completeReview.bind(this)
    this.toggleRejectedSection = this.toggleRejectedSection.bind(this)

    this.state = {
      selectedItemCount: 0,
      contentList: [],
      winnerList: [],
      postionIndex: [-1, -1, -1],
      isReviewed: false
    }
  }

  /**
   * This function gets triggered when the checked state of radio change
   */
  checkActionHandler(forPosition, isChecked, index) {
    const textinputs = document.querySelectorAll('input[type=radio]')
    const selected = [].filter.call(textinputs, (el) => {
      return el.checked
    })
    const winnerList = []
    winnerList.push(this.state.contentList[8])
    winnerList.push(this.state.contentList[2])
    winnerList.push(this.state.contentList[1])
    winnerList.push(this.state.contentList[6])

    const postionIndex = this.state.postionIndex
    if (isChecked) {
      switch (forPosition) {
      case 1:
        postionIndex[0] = index
        break

      case 2:
        postionIndex[1] = index
        break

      case 3:
        postionIndex[2] = index
        break
      }
    }
    this.setState({
      postionIndex,
      selectedItemCount: selected.length,
      winnerList
    })

  }

  /**
   * complete review actions
   */
  completeReview() {
    if (this.state.selectedItemCount >= 3) {
      this.setState({
        isReviewed: true
      })
    }
  }

  componentWillMount() {
    const contentListItems = this.props.postContent ? this.props.postContent.submissions.slice(0) : []
    this.setState({
      contentList: contentListItems
    })
    this.checkActionHandler()
  }

  /**
   * toggles open closed states of rejected section
   */
  toggleRejectedSection() {
    this.setState({
      isRejectedExpanded: !this.state.isRejectedExpanded
    })
  }

  render() {
    const props = this.props
    const postContent = this.props.postContent

    return (
      <div styleName={'milestone-post-specification '
        + (props.theme ? props.theme : '')
        + (props.isCompleted ? ' completed ' : '')
        + (props.inProgress ? 'in-progress' : '')
      }
      >
        <span styleName="dot" />

        <div styleName={this.state.isReviewed ? 'hide' : 'show'}>
          {/* all items list for section */}
          <header styleName="milestone-heading" className="flex space-between">
            <span>{postContent.checkpointHeading}</span>
            <span styleName="place place-md">Place</span>
          </header>
          {
            this.state.contentList && this.state.contentList.length > 0 && this.state.contentList.map((content, i) => {
              return (
                <div styleName="content-link-wrap seperation-sm" key={i}>
                  {/* milestone add-a-link type content  */}
                  {!!content && !!content.type && content.type === 'submission-selection-entry' &&
                    (<div styleName="add-specification-wrap seperation-sm">
                      <WinnerSelectionBar label={content.label} link={content.link}
                        isCompleted={content.isCompleted} inProgress={content.inProgress}
                        icon={content.linkType}
                        index={i}
                        postionIndex={ this.state.postionIndex }
                        checkActionHandler={this.checkActionHandler}
                      />
                    </div>)
                  }
                </div>
              )
            })
          }

          {this.state.selectedItemCount > 0 && this.state.selectedItemCount < 3 && (
            <div styleName="message-bar" className="flex center">
              <i>Please select all 3 places to complete the review</i>
            </div>
          )}
          {(
            <div styleName="action-bar" className="flex center">
              <button styleName="tc-btn" className={'tc-btn ' + (this.state.selectedItemCount >= 3 ? 'tc-btn-primary' : '')}
                onClick={this.completeReview}
              >Complete review (32h remaining)</button>
            </div>
          )}
        </div>

        <div styleName={this.state.isReviewed ? 'show' : 'hide'}>
          {/* all items list for section */}
          <header styleName="milestone-heading selected-theme" className="flex space-between">
            <span>{postContent.selectedHeading}</span>
            <span styleName="place">Place</span>
          </header>
          {
            this.state.winnerList && this.state.winnerList.length > 0 && this.state.winnerList.map((content, i) => {
              return (
                <div styleName="content-link-wrap seperation-sm" key={i}>
                  {/* milestone add-a-link type content  */}
                  {!!content && !!content.type && content.type === 'submission-selection-entry' &&
                    (<div styleName="add-specification-wrap seperation-sm">
                      <WinnerSelectionBar label={content.label} link={content.link}
                        icon={content.linkType}
                        index={i}
                        postionIndex={this.state.postionIndex}
                        checkActionHandler={this.checkActionHandler}
                      />
                    </div>)
                  }
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

WinnerSelection.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool
}

export default WinnerSelection
