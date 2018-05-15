import React from 'react'
import PT from 'prop-types'
import './SubmissionSelection.scss'
import MilestonePostLink from '../MilestonePostLink'

class SubmissionSelection extends React.Component {
  constructor(props) {
    super(props)

    this.checkActionHandler = this.checkActionHandler.bind(this)
    this.completeReview = this.completeReview.bind(this)
    this.toggleRejectedSection = this.toggleRejectedSection.bind(this)

    this.state = {
      selectedItemCount: 0,
      showWarning: false,
      contentList: [],
      selectedItems: [],
      rejectedItems: [],
      isReviewed: false
    }
  }

  /**
   * This function gets triggered when the checked state of checkboxes change
   */
  checkActionHandler(isChecked, index) {
    const textinputs = document.querySelectorAll('input[type=checkbox]')
    const selected = [].filter.call(textinputs, (el) => {
      return el.checked
    })
    const contentListItems = this.props.postContent ? this.props.postContent.submissions.slice(0) : []
    const selectedItems = []
    const rejectedItems = []
    index > -1 ? contentListItems[index].isSelected = isChecked : ''
    contentListItems.map((item, i) => {
      if (i === index) {
        item[isSelected] = isChecked
      }
      const isSelected = item.isSelected
      isSelected
        ? selectedItems.push(item)
        : rejectedItems.push(item)
    })

    this.setState({
      selectedItemCount: selected.length,
      showWarning: selected.length < 5 && selected.length > 0,
      isRejectedExpanded: false,
      contentList: contentListItems,
      selectedItems,
      rejectedItems
    })
  }

  /**
   * complete review actions
   */
  completeReview() {
    if (this.state.selectedItemCount >= 5) {
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
          <header styleName="milestone-heading">
            {postContent.checkpointHeading}
          </header>
          {
            this.state.contentList && this.state.contentList.length > 0 && this.state.contentList.map((content, i) => {
              return (
                <div styleName="content-link-wrap seperation-sm" key={i}>
                  {/* milestone add-a-link type content  */}
                  {!!content && !!content.type && content.type === 'submission-selection-entry' &&
                    (<div styleName="add-specification-wrap seperation-sm">
                      <MilestonePostLink label={content.label} link={content.link}
                        isCompleted={content.isCompleted} inProgress={content.inProgress}
                        icon={content.linkType}
                        index={i}
                        checkActionHandler={this.checkActionHandler}
                      />
                    </div>)
                  }
                </div>
              )
            })
          }

          {this.state.showWarning && (
            <div styleName="message-bar" className="flex center">
              <i>Please select all 5 designs to complete the review</i>
            </div>
          )}
          {(
            <div styleName="action-bar" className="flex center">
              <button styleName="tc-btn" className={'tc-btn ' + (this.state.selectedItemCount >= 5 ? 'tc-btn-primary' : '')}
                onClick={this.completeReview}
              >Complete review (48h remaining)</button>
            </div>
          )}
        </div>


        <div styleName={this.state.isReviewed ? 'show' : 'hide'}>
          {/* selected item list */}
          <header styleName={'milestone-heading selected-theme'}>
            {postContent.selectedHeading}
          </header>
          {
            this.state.selectedItems && this.state.selectedItems.length > 0 && this.state.selectedItems.map((content, i) => {
              return (
                <div styleName="content-link-wrap seperation-sm" key={i}>
                  {/* milestone add-a-link type content  */}
                  {!!content && !!content.type && content.type === 'submission-selection-entry' &&
                    (<div styleName="add-specification-wrap seperation-sm">
                      <MilestonePostLink label={content.label} link={content.link}
                        isCompleted={content.isCompleted} inProgress={content.inProgress}
                        icon={content.linkType}
                        index={i}
                        isReadonly
                        isSelected={content.isSelected}
                      />
                    </div>)
                  }
                </div>
              )
            })
          }

          {/* rejected item list */}
          <header styleName={'milestone-heading rejected-theme sepeartion-md  no-line ' + (this.state.isRejectedExpanded ? 'open' : 'close')}
            onClick={this.toggleRejectedSection}
          >
            {postContent.rejectedHeading}
          </header>
          {
            this.state.rejectedItems && this.state.rejectedItems.length > 0 && this.state.rejectedItems.map((content, i) => {
              return (
                <div styleName={'content-link-wrap seperation-sm ' + (this.state.isRejectedExpanded ? 'open' : 'close') } key={i}>
                  {/* milestone add-a-link type content  */}
                  {!!content && !!content.type && content.type === 'submission-selection-entry' &&
                    (<div styleName="add-specification-wrap seperation-sm">
                      <MilestonePostLink label={content.label} link={content.link}
                        isCompleted={content.isCompleted} inProgress={content.inProgress}
                        icon={content.linkType}
                        isSelected={content.isSelected}
                        index={i}
                        isReadonly
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

SubmissionSelection.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool
}

export default SubmissionSelection
