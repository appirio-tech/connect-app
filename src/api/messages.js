import omit from 'lodash/omit'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import { axiosInstance as axios } from './requestInterceptor'
import { CONNECT_MESSAGE_API_URL } from '../config/constants'

const timeout = 1.5 * 60 * 1000

export function getTopics(criteria) {
  const params = {}
  // filters
  const filter = omit(criteria, ['sort'])
  if (!isEmpty(filter)) {
    // convert filter object to string
    const filterStr = Object.keys(filter).map(k => `${k}=${filter[k]}`)
    params.filter = filterStr.join('&')
  }

  return axios.get(`${CONNECT_MESSAGE_API_URL}/v4/topics/`, { params })
    .then( resp => {
      return {
        totalCount: get(resp.data, 'result.metadata.totalCount', 0),
        topics: get(resp.data, 'result.content', [])
      }
    })
}

export function getTopic(topicId) {
  return axios.get(`${CONNECT_MESSAGE_API_URL}/v4/topics/${topicId}`)
    .then( resp => {
      return {
        totalCount: get(resp.data, 'result.metadata.totalCount', 0),
        topic: get(resp.data, 'result.content', {}),
        topicId
      }
    })
}

export function getTopicPosts(topicId, postIds) {
  const params = { postIds : postIds.join(',') }
  return axios.get(`${CONNECT_MESSAGE_API_URL}/v4/topics/${topicId}/posts`, { params })
    .then( resp => {
      return {
        totalCount: get(resp.data, 'result.metadata.totalCount', 0),
        posts: get(resp.data, 'result.content', []),
        topicId
      }
    })
}

export function createTopic(topicProps) {
  return axios.post(`${CONNECT_MESSAGE_API_URL}/v4/topics/`, topicProps, { timeout })
    .then( resp => {
      return get(resp.data, 'result.content', {})
    })
}

export function saveTopic(topicId, topicProps) {
  return axios.post(`${CONNECT_MESSAGE_API_URL}/v4/topics/${topicId}/edit`, topicProps, { timeout })
    .then( resp => {
      return get(resp.data, 'result.content', {})
    })
}

export function deleteTopic(topicId) {
  return axios.delete(`${CONNECT_MESSAGE_API_URL}/v4/topics/${topicId}`, null, { timeout } )
    .then( resp => {
      return {
        result : get(resp.data, 'result.content', {})
      }
    })
}

export function addTopicPost(topicId, post) {
  return axios.post(`${CONNECT_MESSAGE_API_URL}/v4/topics/${topicId}/posts`, { post: post.content }, { timeout } )
    .then( resp => {
      return {
        topicId,
        comment : get(resp.data, 'result.content', {})
      }
    })
}

export function saveTopicPost(topicId, post) {
  return axios.post(`${CONNECT_MESSAGE_API_URL}/v4/topics/${topicId}/posts/${post.id}/edit`, { post: post.content }, { timeout } )
    .then( resp => {
      return {
        topicId,
        comment : get(resp.data, 'result.content', {})
      }
    })
}

export function getTopicPost(topicId, postId) {
  return axios.get(`${CONNECT_MESSAGE_API_URL}/v4/topics/${topicId}/posts/${postId}`, null, { timeout } )
    .then( resp => {
      return {
        topicId,
        comment : get(resp.data, 'result.content', {})
      }
    })
}

export function deleteTopicPost(topicId, postId) {
  return axios.delete(`${CONNECT_MESSAGE_API_URL}/v4/topics/${topicId}/posts/${postId}`, null, { timeout } )
    .then( resp => {
      return {
        result : get(resp.data, 'result.content', {})
      }
    })
}
