import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import './draftjs.scss'
import RichTextArea from '../RichTextArea/RichTextArea'
import { getUserTrait } from '../../helpers/tcHelpers'

import './NewPost.scss'

class NewPost extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentUserPhotoUrl: null
    }
  }

  componentWillMount() {
    const userHandle = this.props.currentUser.handle
    this.fetchUserTrait(userHandle)
  }

  componentWillReceiveProps(nextProps) {
    const handle = this.props.currentUser.handle
    const newHandle = nextProps.currentUser.handle
    if (handle === newHandle) {
      return
    }
    this.fetchUserTrait(newHandle)
  }

  fetchUserTrait(handle) {
    getUserTrait(handle).then(resp => {
      if (this.props.currentUser.handle === handle) {
        this.setState({currentUserPhotoUrl: resp.photoUrl})
      }
    }).catch(() => {
      this.setState({currentUserPhotoUrl: null})
    })
  }

  render() {
    const {currentUser, allMembers, titlePlaceholder, contentPlaceholder, isCreating, hasError, expandedTitlePlaceholder} = this.props
    let authorName = currentUser.firstName
    if (authorName && currentUser.lastName) {
      authorName += ' ' + currentUser.lastName
    }

    const composerClasses = cn(
      'modal',
      'action-card',
      'new-post-composer'
    )

    return (
      <RichTextArea
        className={composerClasses}
        titlePlaceholder={titlePlaceholder || 'Title of the post'}
        expandedTitlePlaceholder={expandedTitlePlaceholder || titlePlaceholder || 'Title of the post'}
        contentPlaceholder={contentPlaceholder || 'New reply...'}
        onPost={this.props.onPost}
        onPostChange={this.props.onNewPostChange}
        isCreating={isCreating}
        hasError={hasError}
        avatarUrl={this.state.currentUserPhotoUrl}
        authorName={authorName}
        allMembers={allMembers}
      />
    )
  }
}


NewPost.propTypes = {
  expandedTitlePlaceholder: PropTypes.string,
  currentUser: PropTypes.object.isRequired,
  allMembers: PropTypes.object.isRequired,
  onPost: PropTypes.func.isRequired,
  onNewPostChange: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  isCreating: PropTypes.bool
}

export default NewPost
