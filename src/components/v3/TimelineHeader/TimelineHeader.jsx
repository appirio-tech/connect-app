import React from 'react'
import PT from 'prop-types'
import './TimelineHeader.scss'

/**header of timeline */
class TimelineHeader extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { postContent } = this.props
    return (
      <div styleName="timeline-header">
        <div styleName="col-empty-left" />
        <div styleName="col-content-right">
          <h4 styleName="post-title" dangerouslySetInnerHTML={{ __html: postContent.title }} />
          <div styleName="post-con" dangerouslySetInnerHTML={{ __html: postContent.postMsg }} />
        </div>
      </div>
    )
  }
}

TimelineHeader.propTypes = {
  postContent: PT.shape({
    title: PT.string,
    postMsg: PT.string
  })
}

export default TimelineHeader
