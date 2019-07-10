import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'

import CardListHeader from '../CardListHeader/CardListHeader'
import TopicCard from '../TopicCard/TopicCard'
import {
  CONNECT_USER,
  PROJECT_FEED_TYPE_MESSAGES
} from '../../config/constants'

import styles from './TopicGroup.scss'

/**
 * Topic group is a list of topics and the list header (E.g. New messages)
 */
class TopicGroup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      onlyAdmin: false
    }

    this.setOnlyAdmin = this.setOnlyAdmin.bind(this)
  }

  setOnlyAdmin(value) {
    this.setState({
      onlyAdmin: value
    })
  }

  render() {
    const {
      groupTitle,
      topics,
      notificationsByTopic,
      authors,
      projectId,
      unread
    } = this.props
    const { onlyAdmin } = this.state
    const filteredTopics = onlyAdmin
      ? topics.filter(topic => topic.tag === PROJECT_FEED_TYPE_MESSAGES)
      : topics

    return topics && topics.length ? (
      <div>
        <CardListHeader
          onlyAdmin={onlyAdmin}
          onAdminFilterChange={this.setOnlyAdmin}
          title={groupTitle}
          count={topics.length}
        />

        {filteredTopics.length ? (
          filteredTopics.map(topic => (
            <TopicCard
              key={topic.id}
              title={topic.title}
              posts={topic.posts}
              topicId={topic.id}
              projectId={projectId}
              notifications={get(notificationsByTopic, `${topic.id}`)}
              author={get(authors, topic.userId, {
                ...CONNECT_USER,
                userId: topic.userId
              })}
              allMembers={authors}
              isTopcoderOnly={topic.tag === PROJECT_FEED_TYPE_MESSAGES}
              unread={unread}
            />
          ))
        ) : (
          <div className={styles.noPostMessage}>
            No posts available under this category!
          </div>
        )}
      </div>
    ) : null
  }
}

TopicGroup.propTypes = {
  groupTitle: PropTypes.string.isRequired,
  notificationsByTopic: PropTypes.object,
  topics: PropTypes.array,
  authors: PropTypes.object,
  projectId: PropTypes.number,
  unread: PropTypes.bool
}

export default TopicGroup
