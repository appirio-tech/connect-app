import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import {
  CONNECT_MESSAGE_API_URL,
  DISCOURSE_BOT_USERID,
  CODER_BOT_USERID,
  TC_SYSTEM_USERID,
} from '../config/constants'

const timeout = 1.5 * 60 * 1000
const apiBaseUrl = CONNECT_MESSAGE_API_URL

export function getTopics(criteria) {
  const params = {}
  // filters
  const filter = _.omit(criteria, ['sort'])
  if (!_.isEmpty(filter)) {
    // convert filter object to string
    const filterStr = _.map(filter, (v, k) => `${k}=${v}`)
    params.filter = filterStr.join('&')
  }

  return axios.get(`${apiBaseUrl}/topics/list/db`, { params })
    .then( resp => {
      return {
        totalCount: _.get(resp.data, 'result.metadata.totalCount', 0),
        topics: _.get(resp.data, 'result.content', [])
      }
    })
}

export function getTopic(topicId) {
  return axios.get(`${apiBaseUrl}/topics/${topicId}/read/db`)
    .then( resp => {
      return {
        totalCount: _.get(resp.data, 'result.metadata.totalCount', 0),
        topic: _.get(resp.data, 'result.content', {}),
        topicId
      }
    })
}

export function getTopicPosts(topicId, postIds) {
  const params = { postIds : postIds.join(',') }
  return axios.get(`${apiBaseUrl}/topics/${topicId}/posts/list`, { params })
    .then( resp => {
      return {
        totalCount: _.get(resp.data, 'result.metadata.totalCount', 0),
        posts: _.get(resp.data, 'result.content', []),
        topicId
      }
    })
}

export function createTopic(topicProps) {
  return axios.post(`${apiBaseUrl}/topics/create`, topicProps, { timeout })
    .then( resp => {
      return _.get(resp.data, 'result.content', {})
    })
}

export function saveTopic(topicId, topicProps) {
  return axios.post(`${apiBaseUrl}/topics/${topicId}/edit`, topicProps, { timeout })
    .then( resp => {
      return _.get(resp.data, 'result.content', {})
    })
}

export function deleteTopic(topicId) {
  return axios.delete(`${apiBaseUrl}/topics/${topicId}/remove`, null, { timeout } )
    .then( resp => {
      return {
        result : _.get(resp.data, 'result.content', {})
      }
    })
}

export function addTopicPost(topicId, post) {
  const payload = {
    post: post.content,
    attachmentIds: post.attachmentIds
  }
  return axios.post(`${apiBaseUrl}/topics/${topicId}/posts/create`, payload, { timeout } )
    .then( resp => {
      return {
        topicId,
        comment : _.get(resp.data, 'result.content', {})
      }
    })
}

export function saveTopicPost(topicId, post) {
  const payload = {
    post: post.content,
    attachmentIds: post.attachmentIds
  }
  return axios.post(`${apiBaseUrl}/topics/${topicId}/posts/${post.id}/edit`, payload, { timeout } )
    .then( resp => {
      return {
        topicId,
        comment : _.get(resp.data, 'result.content', {})
      }
    })
}

export function getTopicPost(topicId, postId) {
  return axios.get(`${apiBaseUrl}/topics/${topicId}/posts/${postId}/read`, null, { timeout } )
    .then( resp => {
      return {
        topicId,
        comment : _.get(resp.data, 'result.content', {})
      }
    })
}

export function deleteTopicPost(topicId, postId) {
  return axios.delete(`${apiBaseUrl}/topics/${topicId}/posts/${postId}/remove`, null, { timeout } )
    .then( resp => {
      return {
        result : _.get(resp.data, 'result.content', {})
      }
    })
}

export function getTopicsWithComments(reference, referenceId, tag, removeCoderBotTopics = true) {
  return getTopics({ reference, referenceId, tag })
    .then(({topics, totalCount}) => {
      const additionalPosts = []
      if (removeCoderBotTopics) {
        //remove coderBot posts
        const rTopics = _.remove(topics, i =>
          [DISCOURSE_BOT_USERID, CODER_BOT_USERID, TC_SYSTEM_USERID].indexOf(i.userId) > -1
        )
        totalCount -= rTopics.length
      }
      // if a topic has more than 20 posts then to display the latest posts,
      // we'll have to first retrieve them from the server
      _.forEach(topics, (t) => {
        if (t.posts.length < t.postIds.length) {
          const postIds = t.postIds.slice(t.postIds.length).slice(-6)
          additionalPosts.push(getTopicPosts(t.id, postIds))
        }
        t.posts = _.sortBy(t.posts, ['id'])
      })
      if (additionalPosts.length === 0) {
        // we dont need to retrieve any additional posts
        return { topics, totalCount }
      }
      return Promise.all(additionalPosts)
        .then(postArr => {
          _.forEach(postArr, (p) => {
            const topic = _.find(topics, t => t.id === p.topicId)
            topic.posts = _.sortBy(topic.posts.concat(p.posts), ['id'])
          })
          return { topics, totalCount }
        })

    })
}

export function createTopicAttachment(attachment) {
  return axios.post(`${apiBaseUrl}/topics/attachments/create`, attachment, { timeout } )
    .then( resp => {
      return {
        result : _.get(resp.data, 'result.content', {})
      }
    })
}

export function getTopicAttachment(attachmentId) {
  return axios.get(`${apiBaseUrl}/topics/attachments/${attachmentId}/read`, { timeout } )
    .then( resp => {
      return _.get(resp.data, 'result.content.url', '')
    })
}

export function deleteTopicAttachment(attachmentId) {
  return axios.delete(`${apiBaseUrl}/topics/attachments/${attachmentId}/delete`, { timeout } )
    .then( resp => {
      return {
        result : _.get(resp.data, 'result.content', {})
      }
    })
}
