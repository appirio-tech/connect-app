import _ from 'lodash'
import moment from 'moment'
import { axiosInstance as axios } from './requestInterceptor'
import { TC_API_URL } from '../config/constants'

export function getTopics(criteria, pageNum) {
  const params = {}
  // filters
  const filter = _.omit(criteria, ['sort'])
  if (!_.isEmpty(filter)) {
    // convert filter object to string
    const filterStr = _.map(filter, (v, k) => `${k}=${v}`)
    params.filter = filterStr.join('&')
  }

  // return axios.get(`${TC_API_URL}/v4/topics/`, { params })
  //   .then( resp => {
  //     return {
  //       totalCount: _.get(resp.data, 'result.metadata.totalCount', 0),
  //       topics: _.get(resp.data, 'result.content', [])
  //     }
  //   })

  // Mocked
  return new Promise((resolve, reject) => {
    resolve({
      totalCount: 10,
      topics: [ {
        id: 1,
        userId: 40135978,
        date: moment().add('-1', 'minutes').format(),
        title: 'Congratulations, your project is approved and active in the system!',
        body: `
      <p>@team, we’re all ready and kicking the code challenges. We have 3 ongoing in the community right now, (links: challenge 1, challenge 2, challenge 3) and will have the results in about 7 days from now.</p>
      <br/>
      <p>I’ll post again when we’re at the code review stage. Have a great day!</p>`,
        allowComments: true,
        hasMoreComments: false,
        unread: true,
        totalComments: 0,
        posts: []
      },
      {
        id: 111,
        userId: 40152855,
        date: moment().add('-2', 'days').format(),
        title: 'Update 23: Design challenge finalists are now available to be ranked and we need your feedback',
        body: `
      <p>All challenges are completed and you can now pick the ones you like most. Please have in mind we’ll have to turn those on Aug 15 (5 days from now) to stay on track. Thanks!</p>`,
        allowComments: true,
        hasMoreComments: true,
        unread: false,
        totalComments: 6,
        posts: [
          {
            id: 1,
            date: moment().add('-2', 'h').format(),
            author: 40152856,
            content: 'Hey Christina, that’s a great question. In general you can pick 3 winners, that’s included in the package. If you want to go beyond that you’ll have to pay extra for the winners, thus this will increase the total cost. Anything after 3-rd place costs additional $400 per submission. Hope this helps!'

          },
          {
            id: 2,
            date: moment().add('-1', 'h').format(),
            author: 8547899,
            content: 'Thanks Pat! We’ll look into it with the guys and get back to you as we have our winners. Is there a requirement of how many designs we can pick?'

          }
        ]
      },
      {
        id: 2,
        userId: 40152856,
        date: moment().add('-1', 'days').format(),
        title: 'Good news, everyone! I delivered your project to the puny humans and they’re reviewing it!',
        body: `
<p>It tooke a whole 289ms to pack all the awesome work you did. It usually takes the puny humans around 24h to process so much important information, but fear not, they’ll contact you pretty soon. Coder out.
</p><br/>
<p>P.S. Your app looks really amazing, I want to have a function or two of it when it is ready!</p>`,
        allowComments: false
      },
      {
        id: 3,
        userId: 40152856,
        date: moment().add('-7', 'hours').format(),
        title: 'Coder here! Your project specification is complete, you can submit for review with our experts.',
        body: `
<p>My calculations say we have everything needed, let’s send it over for review. Ususally somebody from our amazing team will get back to you within 24 hours with additional feedback and questions. After all, they’re not Coder the Bot, puny humans!</p>
`,
        allowComments: false,
        sendForReview: true
      },
      {
        id: 4,
        userId: 40152856,
        date: moment().add('-1', 'days').format(),
        title: 'Hey there, I’m ready with the next steps for your project!',
        body: `
<p>I went over the project information and I see we still need to collect more details before I can use my super computational powers and create your quote.</p>
<br/>
<p>Head over to the <a href="javascript:">Specification</a> section and answer all of the required questions. If you already have a document with specification, verify it against our checklist and upload it.</p>
`,
        allowComments: false,
        spec: true
      }]
    })  
  })
}

export function getTopicPosts(topicId) {
  return axios.get(`${TC_API_URL}/v4/topics/${topicId}/posts`)
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

export function addTopicPost(topicId, post) {
  return axios.post(`${TC_API_URL}/v4/topics/${topicId}/posts`, post)
    .then( resp => {
      return _.get(resp.data, 'result.content', {})
    })
}