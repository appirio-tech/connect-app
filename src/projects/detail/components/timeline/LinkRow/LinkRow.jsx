import React from 'react'
import PT from 'prop-types'
import cn from 'classnames'

import SubmissionEditLink from '../SubmissionEditLink'

import './MilestonePost.scss'

class MilestonePost extends React.Component {
  constructor(props) {
    super(props)

    this.toggleEditLink = this.toggleEditLink.bind(this)
    this.deleteLink = this.deleteLink.bind(this)
    this.getLabel = this.getLabel.bind(this)
    this.closeEditForm = this.closeEditForm.bind(this)
    this.updateMilestonePostLink = this.updateMilestonePostLink.bind(this)
    this.updateMilestonePostTitleLink = this.updateMilestonePostTitleLink.bind(this)
    this.updateMilestonePostTitleLinkType = this.updateMilestonePostTitleLinkType.bind(this)
    this.downloadFile = this.downloadFile.bind(this)
    this.updatePost = this.updatePost.bind(this)
    this.deletePost = this.deletePost.bind(this)
    this.onSelectChange = this.onSelectChange.bind(this)

    this.state = {
      isEditing: false,
      milestonePostLink: props.milestonePostLink,
      label: props.label
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isUpdating } = this.props
    const { isEditing } = this.state

    if (
      isEditing && isUpdating &&
      !nextProps.isUpdating && !nextProps.error
    ) {
      this.closeEditForm()
    }
  }

  toggleEditLink() {
    this.setState({isEditing: !this.state.isEditing})
  }

  deleteLink() {

  }

  getLabel() {
    const props = this.props
    if (props.milestoneType === 'specification') {
      return 'Specification'
    }
    return this.props.milestonePostTitle
  }

  closeEditForm() {
    this.setState({isEditing: false})
  }

  updateMilestonePostLink(value) {
    this.closeEditForm()
    this.setState({milestonePostLink: value.URL})
  }

  updateMilestonePostTitleLink(value) {
    this.closeEditForm()
    this.setState({milestonePostLink: value.URL, label: value.title})
  }

  updateMilestonePostTitleLinkType(value) {
    this.closeEditForm()
    this.setState({milestonePostLink: value.URL, label: `${value.title} (${value.type})`})
  }

  downloadFile() {
    alert('ff')
  }

  updatePost(values) {
    const { updatePost, itemId } = this.props

    updatePost(values, itemId)
  }

  deletePost() {
    const { deletePost, itemId } = this.props

    deletePost(itemId)
  }

  onSelectChange(evt) {
    const { onSelectChange, itemId } = this.props
    const isSelected = evt.target.checked

    onSelectChange(isSelected, itemId)
  }

  render() {
    const props = this.props
    const labelMilestoneStyle = {}
    if (props.milestoneType === 'only-text') {
      labelMilestoneStyle['background'] = 'url('+ props.image +') 0 50% no-repeat'
    }
    const trueValue = true
    return (
      <div styleName={'milestone-post '
      + (props.theme ? props.theme : '')
      + (props.isCompleted ? 'completed' : '')
      + (props.inProgress ? 'in-progress' : '')
      }
      >
        {
          props.inProgress !== null && props.inProgress !== undefined && !props.isHideDot && (
            <span styleName="dot" >{ props.inProgress}</span>
          )
        }
        {!this.state.isEditing && (
          <div styleName="label-layer">
            {props.milestoneType !== 'download' && (
              <span
                className={'flex-child'}
                styleName={cn('label-title', 'span-first', props.milestoneType) }
                style={ labelMilestoneStyle }
              >
                {this.getLabel()}
              </span>
            )}

            {props.milestoneType === 'download' && (
              <div styleName="group-right only-text hide-sm">
                <a
                  href={this.state.milestonePostLink}
                  download={this.state.milestonePostLink}
                  className={'flex-child'}
                  styleName={'label-title span-first download'}
                >
                  {props.milestonePostLink}
                </a>
              </div>
            )}

            {props.milestoneType === 'marvelapp' && (
              <div styleName="group-right only-text hide-sm">
                <a href={props.milestonePostLink} styleName="milestone-text hide-sm">
                  {props.milestonePostLink}
                </a>
              </div>)
            }

            {props.milestoneType === 'specification' && (
              <div styleName="group-right only-text hide-sm">
                <a
                  href={props.milestonePostLink}
                  styleName="milestone-text hide-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {props.milestonePostLink}
                </a>
              </div>)
            }

            {props.milestoneType === 'only-text' && (
              <div styleName="group-right only-text hide-sm">
                <a
                  href={props.milestonePostLink}
                  styleName="milestone-text hide-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {props.milestonePostLink}
                </a>
              </div>
            )}

            {props.milestoneType === 'file' && (
              <div styleName="group-right file hide-sm">
                <a href={this.state.milestonePostFile}  download={this.state.milestonePostFile} styleName="milestone-text hide-sm" dangerouslySetInnerHTML={{ __html: props.milestonePostFileInfo }} />
                <span styleName="download_icon hide-sm" />
              </div>)
            }

            {!props.updatePost && !props.deletePost && props.milestoneType === 'download' && (
              <div styleName="group-right file hide-sm">
                <a href={this.state.milestonePostLink} download={this.state.milestonePostLink} styleName="download_icon hide-sm" />
              </div>
            )}

            {!!props.updatePost && (
              <span onClick={this.toggleEditLink} styleName="label-title span-two" />
            )}
            {!!props.deletePost && (
              <span onClick={this.deletePost} styleName="label-title span-three" />
            )}

            {!!props.onSelectChange && (
              <div styleName="col-wrapper">
                <label styleName="checkbox-ctrl">
                  <input
                    type="checkbox"
                    styleName="checkbox"
                    onChange={this.onSelectChange}
                  />
                  <span styleName="checkbox-text" />
                </label>
              </div>
            )}

            {!props.onSelectChange && props.isSelected && (
              <div styleName="col-wrapper">
                <span styleName="item-checked" />
              </div>
            )}
          </div>
        )}

        {this.state.isEditing && props.milestoneType === 'specification' && (<div styleName="small-separator">
          <SubmissionEditLink
            callbackCancel={this.closeEditForm}
            defaultValues={{ url: props.milestonePostLink }}
            callbackOK={this.updatePost}
            label={'Edit specification document link'}
            okButtonTitle={'Save changes'}
          />
        </div>)}

        {this.state.isEditing && props.milestoneType === 'marvelapp' && (
          <div styleName="small-separator">
            <SubmissionEditLink
              callbackCancel={this.closeEditForm}
              defaultValues={{
                url: props.milestonePostLink,
                title: props.milestonePostTitle
              }}
              callbackOK={this.updatePost}
              label={'Edit design link'}
              okButtonTitle={'Save changes'}
            />
          </div>
        )}

        {this.state.isEditing && props.milestoneType === 'only-text' && (
          <div styleName="small-separator">
            <SubmissionEditLink
              callbackCancel={this.closeEditForm}
              defaultValues={{ url: props.milestonePostLink }}
              callbackOK={this.updatePost}
              label={'Edit link'}
              okButtonTitle={'Save changes'}
            />
          </div>
        )}

        {this.state.isEditing && props.milestoneType === 'file' && (<div styleName="small-separator">
          <SubmissionEditLink callbackCancel={this.closeEditForm} callbackOK={this.updateMilestonePostTitleLinkType} label={'Edit link'} isHaveType={trueValue} isHaveTitle={trueValue} isHaveUrl={trueValue} inProgress={false} okButtonTitle={'Save changes'} maxTitle={64}/>
        </div>)}

      </div>
    )
  }
}

MilestonePost.defaultProps = {
  milestoneType: 'only-text',
  image: require('../../../../../assets/icons/timeline-invoice.svg'),
  milestonePostLink: '',
  label: '',
  isHideDot: false,
}

MilestonePost.propTypes = {
  label: PT.string,
  isCompleted: PT.bool,
  inProgress: PT.bool,
  milestoneType: PT.string,
  image: PT.string,
  milestonePostLink: PT.string,
  isHideDot: PT.bool,
  deletePost: PT.func
}

export default MilestonePost
