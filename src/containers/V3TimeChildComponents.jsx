import React from 'react'
import V3Template from './V3Template'
import TimelinePost from '../components/v3/TimelinePost'
import TimelineHeader from '../components/v3/TimelineHeader'
import TimelineFinalFix from '../components/v3/TimelineFinalFix'
import './V3ComponentDemo.scss'

// use for demo all individual component
class V3ComponentDemo extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="v3-component-demolist">
        <V3Template>
          <div styleName="viewport">
            <h2 styleName="group-title">Timeline Child components</h2>

            <h3>Timeline header</h3>
            <TimelineHeader postContent={{
              title: 'Welcome to the design phase',
              postMsg : 'This is the first stage in our project. We’re going to show you the detailed plan in your timeline, with all the milestones. During the execution the milestones will change to reflect the progress, collect your feedback, and deliver the final product. Check the <a href="https://www.youtube.com/">YouTube video</a> and our <a href="https://www.youtube.com/">help article</a> for more information. If you still have questions, please ask them in the stage message channel and we’ll be happy to assist you.'
            }}
            />

            <h3>Design acceptance</h3>
            <TimelineFinalFix postContent={{
              postId: '100',
              inProgress: false,
              month: 'MAR',
              date: '10',
              title: 'Completed milestone with no detail',
              postMsg: 'This milestone was completed and is no more interactive.',
            }}
            />

            <h3>Specification</h3>
            <TimelinePost postContent={{
              postId: '100',
              inProgress: false,
              month: 'MAR',
              date: '10',
              title: 'Design delivery',
              postMsg: 'Please find all the source files from the winning designs attached as a .zip file bellow. This concludes our design stage.',
              content: [{
                id: 'a100',
                type: 'specification',
                inProgress: (true),
                isCompleted: (false),
              }]
            }}
            />

            <h3>Download links</h3>
            <TimelinePost postContent={{
              postId: '100',
              inProgress: false,
              month: 'MAR',
              date: '10',
              title: 'Design delivery',
              postMsg: 'Please find all the source files from the winning designs attached as a .zip file bellow. This concludes our design stage.',
              content: [{
                id: 'a100',
                type: 'download',
                inProgress: true,
                label: 'All design source files (567MB .zip)',
                mileStoneLink: 'https://docs.google.com/affdisdfg?5234fasdf&asdfasdf&asdf3vasddfaasdfadfasddsfjlk43jkldsfjas'
              }]
            }}
            />

            <h3>Timeline child components: status with no detail</h3>
            <TimelinePost postContent={{
              postId: '100',
              month: 'MAR',
              isCompleted: true,
              date: '10',
              title: 'Completed milestone with no detail',
            }}
            />

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

            <h3>Timeline child components: status with multiple links</h3>
            <TimelinePost postContent={{
              postId: 'a101',
              inProgress: true,
              month: 'MAR',
              date: '12',
              title: 'Completed milestone with multiple links (list)',
              postMsg: 'This milestone was completed and is no more interactive.',
              content: [{
                id: 'a100',
                type: 'file',
                label: 'All design source files (zip)',
                milestoneFile: require('../assets/icons/timeline-document.svg'),
                milestoneFileInfo: '567MB'
              },
              {
                id: 'a100',
                type: 'file',
                label: 'Winning design source files (zip)',
                milestoneFile: require('../assets/icons/timeline-document.svg'),
                milestoneFileInfo: '123MB'
              },
              {
                id: 'a100',
                type: 'file',
                label: 'Second place design source file (zip)',
                milestoneFile: require('../assets/icons/timeline-document.svg'),
                milestoneFileInfo: '73MB'
              },
              {
                id: 'a100',
                type: 'file',
                label: 'Third place design source files (zip)',
                milestoneFile: require('../assets/icons/timeline-document.svg'),
                milestoneFileInfo: '82MB'
              },
              {
                id: 'a100',
                type: 'invoice',
                label: 'Specification',
                mileStoneLink: 'https://docs.google.com/affdisdfg?5234...',
                image: require('../assets/icons/timeline-document.svg')
              },
              {
                id: 'a100',
                type: 'invoice',
                label: 'GitHub Repo',
                mileStoneLink: 'https://github.com/project',
                image: require('../assets/icons/timeline-github.svg')
              },
              {
                id: 'a100',
                type: 'invoice',
                label: 'Bugs for the project',
                mileStoneLink: 'https://github.com/project/issues',
                image: require('../assets/icons/timeline-github.svg')
              },
              {
                id: 'a100',
                type: 'invoice',
                label: 'Demo app',
                mileStoneLink: 'https://herokuapp.com/69Vb902344G/',
                image: require('../assets/icons/timeline-heroku.svg')
              },
              {
                id: 'a100',
                type: 'invoice',
                label: 'CN Design option 4',
                mileStoneLink: 'https://marvelapp.com/44b43da',
                image: require('../assets/icons/timeline-marvelapp.svg')
              },
              {
                id: 'a100',
                type: 'invoice',
                label: 'Stage Invoice 01',
                mileStoneLink: 'https://docs.google.com/affdisdfg?5234fasdf&asdfasdf&asdf3vasddfaasdfadfasddsfjlk43jkldsfjas',
                image: require('../assets/icons/timeline-invoice.svg')
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

            <h3>Status with progress bar, status with progress bar state Ready for review and action bar </h3>
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
                theme: 'light',
                readyForReview: true
              },
              {
                id: 'a200',
                type: 'add-a-link',
                label: 'Add a design link'
              },
              {
                id: 'a100',
                type: 'message',
                label: 'Milestone extension request',
                message: 'Be careful, requesting extensions will change the project overall milestone. Proceed with caution and only if there are not enough submissions to satisfy our delivery policy.',
                backgroundColor: '#FFF4F4',
                isShowSelection: true,
                button1Title: 'Cancel',
                button2Title: 'Request extension'
              },
              {
                id: 'a100',
                type: 'message',
                label: 'Complete milestone review',
                message: 'Warning! Complete the review only if you have the permission from the customer. We do not want to close the review early without the ability to get feedback from our customers and let them select the winning 5 designs for next round.',
                backgroundColor: '#FFF4F4',
                button1Title: 'Cancel',
                button2Title: 'Complete review'
              },
              {
                id: 'a100',
                type: 'message',
                label: 'Milestone extension requested',
                message: 'Due to unusually high load on our network we had less than the minimum number or design submissions. In order to provide you with the appropriate number of design options we’ll have to extend the milestone with 48h. This time would be enough to increase the capacity and make sure your project is successful.<br /><br />Please make a decision in the next 24h. After that we will automatically extend the project to make sure we deliver success to you.',
                backgroundColor: '#CEE6FF',
                button2Title: 'Decline extension',
                button3Title: 'Approve extension'
              }]
            }}
            />
            
            <h3>Submission Edit Link</h3>
            <TimelinePost postContent={{
              postId: 'a101',
              inProgress: true,
              month: 'MAR',
              date: '12',
              title: 'Complete specification',
              postMsg: 'Thanks for picking those designs! You rock! Rate your experience with our copilot!',
              content: [{
                id: 'a100',
                type: 'edit-link',
                label: 'Edit specification document link',
                maxTitle: 64,
                isHaveUrl: true
              },
              {
                id: 'a100',
                type: 'edit-link',
                label: 'Edit link',
                maxTitle: 64,
                isHaveTitle: true,
                isHaveUrl: true,
                isHaveType: true
              },
              {
                id: 'a100',
                type: 'edit-link',
                label: 'New design link',
                maxTitle: 64,
                isHaveTitle: true,
                isHaveUrl: true
              },
              {
                id: 'a100',
                type: 'edit-link',
                label: 'New design link',
                maxTitle: 64,
                isHaveTitle: true,
                isHaveUrl: true,
                isHaveSubmissionId: true
              },
              {
                id: 'a100',
                type: 'edit-link',
                label: 'Milestone Properties',
                maxTitle: 64,
                isHaveTitle: true,
                isHaveDate: true,
                isHavePlannedText: true,
                isHaveActiveText: true,
                isHaveCompletedText: true
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