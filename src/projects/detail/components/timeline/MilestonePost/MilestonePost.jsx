import React from 'react'
import PT from 'prop-types'
import './MilestonePost.scss'
import SubmissionEditLink from '../SubmissionEditLink'



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


    this.state = {
      isEditting: false,
      milestonePostLink: props.milestonePostLink,
      label: props.label
    }
  }

  toggleEditLink() {
    this.setState({isEditting: !this.state.isEditting})
  }

  deleteLink() {

  }

  getLabel() {
    const props = this.props
    if (props.milestoneType === 'specification') {
      return 'Specification'
    }
    return this.state.label
  }

  closeEditForm() {
    this.setState({isEditting: false})
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
        {!this.state.isEditting && (<div styleName="label-layer">
          {props.milestoneType !== 'download' && (<span className={'flex-child'} styleName={'label-title span-first ' + ((props.milestoneType === 'file') ? 'file ' : '') + ((props.milestoneType === 'download') ? 'download ' : '') + ((props.milestoneType === 'specification') ? 'specification ' : '') } style={ labelMilestoneStyle }>
            {this.getLabel()}
          </span>)}
          {props.milestoneType === 'download' && (<a href={this.state.milestonePostLink} download={this.state.milestonePostLink} className={'flex-child'} styleName={'label-title span-first download'}>
            {this.getLabel()}
          </a>)}

          {props.milestoneType === 'specification' && (<div styleName="group-right only-text hide-sm">
            <a href={this.state.milestonePostLink} styleName="milestone-text hide-sm" dangerouslySetInnerHTML={{ __html: this.state.milestonePostLink }} />
          </div>)}

          {props.milestoneType === 'only-text' && (<div styleName="group-right only-text hide-sm">
            <a href={this.state.milestonePostLink} styleName="milestone-text hide-sm" dangerouslySetInnerHTML={{ __html: this.state.milestonePostLink }} />
          </div>)}

          {props.milestoneType === 'file' && (<div styleName="group-right file hide-sm">
            <a href={this.state.milestonePostFile}  download={this.state.milestonePostFile} styleName="milestone-text hide-sm" dangerouslySetInnerHTML={{ __html: props.milestonePostFileInfo }} />
            <span styleName="download_icon hide-sm" />
          </div>)}

          {props.milestoneType === 'download' && (<div styleName="group-right file hide-sm">
            <span  download={this.state.milestonePostFile} styleName="download_icon hide-sm" />
          </div>)}

          {props.milestoneType !== 'download' && (<div>
            <span onClick={this.toggleEditLink} styleName={ 'label-title span-two' } />
            <span onClick={props.deletePost} styleName={ 'label-title span-three' } />
          </div>)}

        </div>)}

        {this.state.isEditting && props.milestoneType === 'specification' && (<div styleName="small-separator">
          <SubmissionEditLink urlValueDefault={this.state.milestonePostLink} callbackCancel={this.closeEditForm} callbackOK={this.updateMilestonePostLink} label={'Edit specification document link'} isHaveUrl={trueValue} inProgress={false} okButtonTitle={'Save changes'} maxTitle={64}/>
        </div>)}

        {this.state.isEditting && props.milestoneType === 'only-text' && (<div styleName="small-separator">
          <SubmissionEditLink callbackCancel={this.closeEditForm} callbackOK={this.updateMilestonePostTitleLink} label={'Edit link'} isHaveTitle={trueValue} isHaveUrl={trueValue} inProgress={false} okButtonTitle={'Save changes'} maxTitle={64}/>
        </div>)}

        {this.state.isEditting && props.milestoneType === 'file' && (<div styleName="small-separator">
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
  deletePost: () => {}
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
