import React, {PropTypes} from 'react'
import cn from 'classnames'
import './draftjs.scss'
import RichTextArea from '../RichTextArea/RichTextArea'

class NewPost extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const {currentUser, titlePlaceholder, isCreating, hasError} = this.props
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
          onPost={this.props.onPost}
          onPostChange={this.props.onNewPostChange}
          isCreating={isCreating}
          hasError={hasError}
          avatarUrl={currentUser.photoURL}
          authorName={authorName}
      />
    )
  }
}


NewPost.propTypes = {
  currentUser: PropTypes.object.isRequired,
  onPost: PropTypes.func.isRequired,
  onNewPostChange: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  isCreating: PropTypes.bool
}

export default NewPost
