import React from 'react'
import PT from 'prop-types'
import './PostCard.scss'
import PostAddComment from '../../../components/v3/PostAddComment/PostAddComment'

const PostCard = () => {
  return (
    <div styleName="post-card">
      <div className="action-card">
        <div className="expanded-card">
          <div className="comment">
            <PostAddComment
              className={'post-card-input'}
              titlePlaceholder={'titlePlaceholder' || 'Title of the post'}
              contentPlaceholder={'Write a post'}
              onPost={() => {console.log('onPost event triggered')}}
              onPostChange={() => { console.log('onPostChange event triggered') }}
              isCreating={false}
              hasError={false}
              authorName={'John Smith'}
              allMembers={{ m: 'allMembers' }}
              editMode={false}
              canSubmit
              allowImages
            />
          </div>
        </div>
      </div>
    </div>
  )
}

PostCard.propTypes = {
  progressPercent: PT.string,
  labelDayStatus: PT.string,
  labelSpent: PT.string,
  labelStatus: PT.string
}

export default PostCard
