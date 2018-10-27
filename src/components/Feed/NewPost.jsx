import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import './draftjs.scss'
import RichTextArea from '../RichTextArea/RichTextArea'

import './NewPost.scss'

class NewPost extends React.Component {

  constructor(props) {
    super(props)
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
        avatarUrl={currentUser.photoURL}
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
