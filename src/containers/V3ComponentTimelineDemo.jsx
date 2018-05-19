import React from 'react'
import V3Template from './V3Template'
import Timeline from '../components/v3/Timeline'
import TimelinePost from '../components/v3/TimelinePost'
import './V3ComponentDemo.scss'

class V3ComponentDemo extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="v3-component-demolist">
        <V3Template>
          <div styleName="viewport">
            
            <h2 styleName="group-title">Timeline</h2>
            <Timeline />
          </div>

          <div styleName="viewport">
            <h2 styleName="group-title">Timeline Child components</h2>
            <h3>Timeline child components: status with no content</h3>
            <TimelinePost postContent={{
              postId: '100',
              month: 'MAR',
              date: '11',
              title: 'Completed milestone with no content',
              postMsg: 'This milestone was completed and is no more interactive.'
            }}
            />

            <h3>Timeline child components: status with content cards</h3>
            <TimelinePost postContent={{
              postId: 'a101',
              inProgress: true,
              month: 'MAR',
              date: '12',
              title: 'Completed milestone with content',
              postMsg: 'This milestone was completed and is no more interactive.',
              content: [{
                id: 'a100',
                type: 'invoice',
                inProgress: true,
                label: 'Stage Invoice 02',
                mileStoneLink: 'https://docs.google.com/affdisdfg?5234fasdf&asdfasdf&asdf3vasddfaasdfadfasddsfjlk43jkldsfjas'
              }]
            }}
            />

            <h3>Timeline child components: status with progress bar</h3>
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

            <h3>Status with progress bar, status with progress bar and action bar </h3>
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

        </V3Template>
      </div >
    )
  }
}

export default V3ComponentDemo