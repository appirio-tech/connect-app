import _ from 'lodash'
import moment from 'moment'
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

// as paging is not available and all posts for a topic are loaded in GET calls,
// this method is not being used now
export function getTopicPosts(topicId, fromIndex) {
  console.log(fromIndex)
  // return axios.get(`${TC_API_URL}/v4/topics/${topicId}/posts`)
  //   .then( resp => {
  //     return {
  //       totalCount: _.get(resp.data, 'result.metadata.totalCount', 0),
  //       posts: _.get(resp.data, 'result.content', [])
  //     }
  //   })

  return new Promise((resolve) => {
    resolve({
      totalCount: 7,
      topicId,
      posts: [
        {
          id: new Date().getTime(),
          date: moment().add('-1', 'd').format(),
          userId: 40152855,
          content: 'Lorem ipsum'

        },
        {
          id: new Date().getTime() + 1,
          date: moment().add('-1', 'd').format(),
          userId: 40152856,
          content: 'Lorem ipsum dolor it somor'
        }
      ]
    })
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
        comment: {
          id: post.date.getTime(),
          date: post.date, //TODO remove after api returns the newly created object
          userId: post.userId, //TODO remove after api returns the newly created object
          // body: _.get(resp.data, 'result.content', {})
          body : post.content//TODO remove after api returns the newly created object          
        }
      }
    })
}
/*eslint-enable*/