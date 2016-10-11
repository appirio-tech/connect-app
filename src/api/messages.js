import _ from 'lodash'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

export function getTopics(criteria) {
  const params = {}
  // filters
  const filter = _.omit(criteria, ['sort'])
  if (!_.isEmpty(filter)) {
    // convert filter object to string
    const filterStr = _.map(filter, (v, k) => `${k}=${v}`)
    params.filter = filterStr.join('&')
  }

  return axios.get(`${TC_API_URL}/v4/topics/`, { params })
    .then( resp => {
      return {
        totalCount: _.get(resp.data, 'result.metadata.totalCount', 0),
        topics: _.get(resp.data, 'result.content', [])
      }
    })
}

export function getTopicPosts(topicId, postIds) {
  console.log(postIds)
  const params = { postIds : postIds.join(',') }
  return axios.get(`${TC_API_URL}/v4/topics/${topicId}/posts`, { params })
    .then( resp => {
      return {
        totalCount: _.get(resp.data, 'result.metadata.totalCount', 0),
        posts: _.get(resp.data, 'result.content', [])
      }
    })
}

export function createTopic(topicProps) {
  return axios.post(`${TC_API_URL}/v4/topics/`, topicProps)
    .then( resp => {
      return _.get(resp.data, 'result.content', {})
    })
}

// ignore resp
/*eslint-disable no-unused-vars */
export function addTopicPost(topicId, post) {
  return axios.post(`${TC_API_URL}/v4/topics/${topicId}/posts`, { post: post.content } )
    .then( resp => {
      return {
        topicId,
        comment : _.get(resp.data, 'result.content', {})
      }
    })
}
/*eslint-enable*/
