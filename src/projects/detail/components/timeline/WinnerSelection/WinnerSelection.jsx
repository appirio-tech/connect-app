import React from 'react'
import PT from 'prop-types'
import './WinnerSelection.scss'
import WinnerSelectionBar from '../WinnerSelectionBar'
import MilestonePost from '../MilestonePost'


class WinnerSelection extends React.Component {
  constructor(props) {
    super(props)

    this.checkActionHandler = this.checkActionHandler.bind(this)
    this.checkBonusActionHandler = this.checkBonusActionHandler.bind(this)
    this.completeReview = this.completeReview.bind(this)
    this.toggleRejectedSection = this.toggleRejectedSection.bind(this)
    this.completeSelect3TopWin = this.completeSelect3TopWin.bind(this)
    this.state = {
      selectedItemCount: 0,
      contentList: [],
      winnerList: [],
      postionIndex: [-1, -1, -1],
      isReviewed: false,
      isSelected3TopWin: false,
      isCompleted: props.isCompleted,
      inProgress: props.inProgress
    }
  }

  /**
   * This function gets triggered when the checked state of radio change
   */
  checkBonusActionHandler(isChecked, index) {
    const contentList = this.state.contentList
    contentList[index].isWinBonus = isChecked
    this.setState({ contentList })
    this.resetWinnerList()
  }

  resetWinnerList() {
    const winnerList = []
    this.setState({
      winnerList
    })
    const postionIndex = this.state.postionIndex
    if (postionIndex[0] >= 0) {
      winnerList.push(this.state.contentList[postionIndex[0]])
    }
    if (postionIndex[1] >= 0) {
      winnerList.push(this.state.contentList[postionIndex[1]])
    }
    if (postionIndex[2] >= 0) {
      winnerList.push(this.state.contentList[postionIndex[2]])
    }
    this.state.contentList.map((content) => {
      if (content.isWinBonus) {
        winnerList.push(content)
      }
    })
  }

  /**
   * This function gets triggered when the checked state of radio change
   */
  checkActionHandler(forPosition, isChecked, index) {
    const textinputs = document.querySelectorAll('input[type=radio]')
    const selected = [].filter.call(textinputs, (el) => {
      return el.checked
    })

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
      selectedItemCount: selected.length
    })
    this.resetWinnerList()
  }

  /**
   * complete review actions
   */
  completeReview() {
    if (this.state.selectedItemCount >= 0) {
      this.setState({
        isReviewed: true,
        isCompleted: true,
        inProgress: false,
        isSelected3TopWin: false
      })
    }
    this.props.finish()
  }

  /**
   * complete review actions
   */
  completeSelect3TopWin() {
    if (this.state.selectedItemCount >= 0) {
      this.setState({
        isSelected3TopWin: true
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
        + (this.state.isCompleted ? ' completed ' : '')
        + (this.state.inProgress ? 'in-progress ' : '')
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
                        checkBonusActionHandler={this.checkBonusActionHandler}
                        isReviewed={this.state.isReviewed}
                        isSelected3TopWin={this.state.isSelected3TopWin}
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
          {this.state.selectedItemCount > 0 && (
            <div styleName="action-bar" className="flex center">
              {!this.state.isSelected3TopWin && (<button styleName="tc-btn" className={'tc-btn ' + (this.state.selectedItemCount >= 0 ? 'tc-btn-primary' : '')} onClick={this.completeSelect3TopWin} >Complete select 3 top win (32h remaining)</button>)}
              {this.state.isSelected3TopWin && (<button styleName="tc-btn" className={'tc-btn ' + (this.state.selectedItemCount >= 0 ? 'tc-btn-primary' : '')} onClick={this.completeReview} >Complete review (32h remaining)</button>)}
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
                        isReviewed={this.state.isReviewed}
                        isSelected3TopWin={this.state.isSelected3TopWin}
                      />
                    </div>)
                  }
                </div>
              )
            })
          }
        </div>

        {props.isCompleted && (<div styleName="seperation-sm">
          <MilestonePost label={'All design source files (567MB .zip)'} milestonePostFile={'https://docs.google.com/affdisdfg?5234fasdf&asdfasdf&asdf3vasddfaasdfadfasddsfjlk43jkldsfjas'} isCompleted={props.isCompleted} inProgress={props.inProgress} milestoneType={'download'}/>
        </div>)}

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
  inProgress: PT.bool,
  finish: PT.func
}
WinnerSelection.defaultProps = {
  isCompleted: false,
  inProgress: true,
  finish: () => {}
}

export default WinnerSelection
