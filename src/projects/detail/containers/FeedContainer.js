import React from 'react'
import NewPost from '../../../components/Feed/NewPost'
import Feed from '../../../components/Feed/Feed'
import ProjectSpecification from '../../../components/ProjectSpecification/ProjectSpecification'
import moment from 'moment'

export default class FeedContainer extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      currentUser: {
        userId: 1,
        handle: 'christina_underwood',
        firstName: 'Christina',
        lastName: 'Underwood',
        photoURL: require('../../../styles/i/profile1.jpg')
      },
      feeds: [
        {
          id: 1,
          user: {
            firstName: 'Patrick',
            lastName: 'Monahan',
            photoURL: require('../../../styles/i/profile2.jpg')
          },
          date: moment().add('-1', 'minutes').format(),
          title: 'Congratulations, your project is approved and active in the system!',
          html: `
        <p>@team, we’re all ready and kicking the code challenges. We have 3 ongoing in the community right now, (links: challenge 1, challenge 2, challenge 3) and will have the results in about 7 days from now.</p>
        <br/>
        <p>I’ll post again when we’re at the code review stage. Have a great day!</p>`,
          allowComments: true,
          hasMoreComments: false,
          unread: true,
          totalComments: 0,
          comments: []
        },
        {
          id: 111,
          user: {
            firstName: 'Patrick',
            lastName: 'Monahan',
            photoURL: require('../../../styles/i/profile2.jpg')
          },
          date: moment().add('-2', 'days').format(),
          title: 'Update 23: Design challenge finalists are now available to be ranked and we need your feedback',
          html: `
        <p>All challenges are completed and you can now pick the ones you like most. Please have in mind we’ll have to turn those on Aug 15 (5 days from now) to stay on track. Thanks!</p>`,
          allowComments: true,
          hasMoreComments: true,
          unread: false,
          totalComments: 6,
          comments: [
            {
              id: 1,
              date: moment().add('-2', 'h').format(),
              author: {
                userId: 2,
                firstName: 'Patrick',
                lastName: 'Monahan',
                photoURL: require('../../../styles/i/avatar-patrick.png')
              },
              content: 'Hey Christina, that’s a great question. In general you can pick 3 winners, that’s included in the package. If you want to go beyond that you’ll have to pay extra for the winners, thus this will increase the total cost. Anything after 3-rd place costs additional $400 per submission. Hope this helps!'

            },
            {
              id: 2,
              date: moment().add('-1', 'h').format(),
              author: {
                userId: 1,
                firstName: 'Christina',
                lastName: 'Underwood',
                photoURL: require('../../../styles/i/profile1.jpg')
              },
              content: 'Thanks Pat! We’ll look into it with the guys and get back to you as we have our winners. Is there a requirement of how many designs we can pick?'

            }
          ]
        },
        {
          id: 2,
          user: {
            firstName: 'Coder',
            lastName: 'The Bot',
            photoURL: require('../../../styles/i/avatar-coder.png')
          },
          date: moment().add('-1', 'days').format(),
          title: 'Good news, everyone! I delivered your project to the puny humans and they’re reviewing it!',
          html: `
<p>It tooke a whole 289ms to pack all the awesome work you did. It usually takes the puny humans around 24h to process so much important information, but fear not, they’ll contact you pretty soon. Coder out.
</p><br/>
<p>P.S. Your app looks really amazing, I want to have a function or two of it when it is ready!</p>`,
          allowComments: false
        },
        {
          id: 3,
          user: {
            firstName: 'Coder',
            lastName: 'The Bot',
            photoURL: require('../../../styles/i/avatar-coder.png')
          },
          date: moment().add('-7', 'hours').format(),
          title: 'Coder here! Your project specification is complete, you can submit for review with our experts.',
          html: `
<p>My calculations say we have everything needed, let’s send it over for review. Ususally somebody from our amazing team will get back to you within 24 hours with additional feedback and questions. After all, they’re not Coder the Bot, puny humans!</p>
`,
          allowComments: false,
          sendForReview: true
        },
        {
          id: 4,
          user: {
            firstName: 'Coder',
            lastName: 'The Bot',
            photoURL: require('../../../styles/i/avatar-coder.png')
          },
          date: moment().add('-1', 'days').format(),
          title: 'Hey there, I’m ready with the next steps for your project!',
          html: `
<p>I went over the project information and I see we still need to collect more details before I can use my super computational powers and create your quote.</p>
<br/>
<p>Head over to the <a href="javascript:">Specification</a> section and answer all of the required questions. If you already have a document with specification, verify it against our checklist and upload it.</p>
`,
          allowComments: false,
          spec: true
        }
      ]
    }
    this.onNewPost = this.onNewPost.bind(this)
    this.onNewCommentChange = this.onNewCommentChange.bind(this)
    this.onLoadMoreComments = this.onLoadMoreComments.bind(this)
    this.onAddNewComment = this.onAddNewComment.bind(this)
  }

  onNewPost({title, content}) {
    this.setState({
      feeds: [
        {
          id: new Date().getTime(),
          user: this.state.currentUser,
          date: new Date().toISOString(),
          title,
          html: content,
          allowComments: true,
          totalComments: 0,
          comments: []
        },
        ...this.state.feeds
      ]
    })
  }


  onNewCommentChange(feedId, content) {
    this.setState({
      feeds: this.state.feeds.map((item) => {
        if (item.id === feedId) {
          return {...item, newComment: content}
        }
        return item
      })
    })
  }

  onLoadMoreComments(feedId) {
    this.setState({
      feeds: this.state.feeds.map((item) => {
        if (item.id === feedId) {
          return {...item, isLoadingMoreComments: true}
        }
        return item
      })
    })
    setTimeout(() => {
      this.setState({
        feeds: this.state.feeds.map((item) => {
          if (item.id === feedId) {
            return {
              ...item,
              isLoadingMoreComments: false,
              hasMoreComments: item.comments.length + 2 < item.totalComments,
              comments: [
                {
                  id: new Date().getTime(),
                  date: moment().add('-1', 'd').format(),
                  author: {
                    userId: 2,
                    firstName: 'Patrick',
                    lastName: 'Monahan',
                    photoURL: require('../../../styles/i/avatar-patrick.png')
                  },
                  content: 'Lorem ipsum'

                },
                {
                  id: new Date().getTime() + 1,
                  date: moment().add('-1', 'd').format(),
                  author: {
                    userId: 1,
                    firstName: 'Christina',
                    lastName: 'Underwood',
                    photoURL: require('../../../styles/i/profile1.jpg')
                  },
                  content: 'Lorem ipsum dolor it somor'
                },
                ...item.comments
              ]
            }
          }
          return item
        })
      })
    }, 700)
  }

  onAddNewComment(feedId) {
    this.setState({
      feeds: this.state.feeds.map((item) => {
        if (item.id === feedId) {
          return {
            ...item,
            newComment: '',
            totalComments: item.totalComments + 1,
            comments: [...item.comments, {
              id: new Date().getTime(),
              date: new Date(),
              author: this.state.currentUser,
              content: item.newComment
            }]
          }
        }
        return item
      })
    })
  }

  render() {
    const {currentUser, feeds} = this.state

    return (
      <div>
        <NewPost currentUser={currentUser} onPost={this.onNewPost} />
        {feeds.map((item) => <div style={{marginTop: '20px'}} key={item.id}>
          <Feed
            {...item}
            currentUser={currentUser}
            onNewCommentChange={this.onNewCommentChange.bind(this, item.id)}
            onAddNewComment={this.onAddNewComment.bind(this, item.id)}
            onLoadMoreComments={this.onLoadMoreComments.bind(this, item.id)}
          >
            {item.sendForReview && <div className="panel-buttons">
              <button className="tc-btn tc-btn-primary tc-btn-md">Send for review</button>
            </div>}
          </Feed>
          {item.spec && <ProjectSpecification />  }
        </div>)}
      </div>
    )
  }
}
