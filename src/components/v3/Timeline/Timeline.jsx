import React from 'react'
import TimelinePost from '../TimelinePost'
import './Timeline.scss'

class Timeline extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeMenu: ''
    }
  }
  
  render() {
    return (
      <div styleName="timeline">
        <TimelinePost postContent={{
          postId: '100',
          isCompleted: true,
          month: 'MAR',
          date: '11',
          title: 'Completed milestone with no content',
          postMsg: 'This milestone was completed and is no more interactive.'
        }} 
        />

        <TimelinePost postContent={{
          postId: 'a101',
          isCompleted: true,
          month: 'MAR',
          date: '12',
          title: 'Completed milestone with content',
          postMsg: 'This milestone was completed and is no more interactive.',
          content: [{
            id: 'a100',
            type: 'invoice',
            isCompleted: true,
            label: 'Stage Invoice 01',
            mileStoneLink: 'https://docs.google.com/affdisdfg?5234fasdf&asdfasdf&asdf3vasddfaasdfadfasddsfjlk43jkldsfjas'
          }]
        }}
        />


        <TimelinePost postContent={{
          postId: 'a102',
          inProgress: true,
          month: 'MAR',
          date: '24',
          title: 'Current milestone with progress bar',
          postMsg: 'This node is currently in progress. Once the progress is complete, the bar will be replaced with content.',
          content: [{
            id: 'a103',
            type: 'progressBar',
            inProgress: true,
            label: '6 days until designs are completed',
            progressPercent: 20,
            theme: 'light'
          }]
        }}
        />

        <TimelinePost postContent={{
          postId: 'a109',
          isCompleted: false,
          month: 'MAR',
          date: '25',
          title: 'Planned milestone',
          postMsg: 'Node description that explains what the stage is going to be like. We can use markdown formatting to make things <strong>bold</strong> or <i>italic</i>, and also attach links. Follow the link to <a href="#">learn more about nodes</a>.'
        }}
        />

        <TimelinePost postContent={{
          postId: 'a109',
          isCompleted: false,
          month: 'MAR',
          date: '25',
          title: 'Planned milestone',
          postMsg: '<strong>Node description that explains what the stage is going to be like</strong>. We can use markdown formatting to make things bold or italic, and also attach links. Follow the link to <a href="#">learn more about nodes</a>.'
        }}
        />

        <TimelinePost postContent={{
          postId: 'a109',
          isCompleted: false,
          month: 'MAR',
          date: '27',
          title: 'Planned milestone',
          postMsg: 'Node description that explains what the stage is going to be like. <i>We can use markdown formatting to make things bold or italic, and also attach links</i>. Follow the link to <a href="#">learn more about nodes</a>.'
        }}
        />

        <TimelinePost postContent={{
          postId: 'a201',
          month: 'MAR',
          date: '28',
          title: 'Final designs',
          inProgress: true,
          postMsg: 'We are working to deliver your best 5 designs. Learn more about <a>how design works on Topcoder</a>',
          content: [{
            id: 'a103',
            type: 'progressBar',
            inProgress: true,
            label: '6 days until designs are completed',
            progressPercent: 20,
            theme: 'light'
          },
          {
            id: 'a200',
            type: 'add-a-link',
            label: 'Add a design link'
          }]
        }}
        />
      </div>
    )
  }
}

export default Timeline
