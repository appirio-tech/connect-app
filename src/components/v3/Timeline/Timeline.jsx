import React from 'react'
import TimelinePost from '../TimelinePost'
import TimelineHeader from '../TimelineHeader'

import './Timeline.scss'
import GenericMenu from '../../../components/v3/GenericMenu'

class Timeline extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      activeMenu: '',
      currentStep: 3,
    }
    this.finishStep3 = this.finishStep3.bind(this)
    this.finishStep4 = this.finishStep4.bind(this)
    this.finishStep5 = this.finishStep5.bind(this)
    this.finishStep6 = this.finishStep6.bind(this)

  }
  
  finishStep3() {
    this.setState({currentStep: 4})
  }
  
  finishStep4() {
    this.setState({currentStep: 5})
  }

  finishStep5() {
    this.setState({currentStep: 6})
  }

  finishStep6() {
    this.setState({currentStep: 7})
  }

  render() {
    return (
      <div styleName="timeline">

        <GenericMenu
          navLinks={
            [{
              id: 'timeline',
              label: 'TIMELINE',
              isActive: true
            }, {
              id: 'posts',
              label: 'POSTS',
              hasNewItems: true
            }, {
              id: 'specification',
              label: 'SPECIFICATION'
            }
            ]}
        />
        <TimelineHeader postContent={{
          title: 'Welcome to the design phase',
          postMsg : 'This is the first stage in our project. We’re going to show you the detailed plan in your timeline, with all the milestones. During the execution the milestones will change to reflect the progress, collect your feedback, and deliver the final product. Check the <a href="https://www.youtube.com/">YouTube video</a> and our <a href="https://www.youtube.com/">help article</a> for more information. If you still have questions, please ask them in the stage message channel and we’ll be happy to assist you.'
        }}
        />
        {this.state.currentStep >= 0 && (
          <TimelinePost postContent={{
            postId: '100',
            isCompleted: true,
            month: 'MAR',
            date: '10',
            title: 'Completed milestone with no detail'
          }}
          />
        )}
        
        {this.state.currentStep >= 1 && (
          <TimelinePost postContent={{
            postId: '100',
            isCompleted: true,
            month: 'MAR',
            date: '11',
            title: 'Completed milestone with no content',
            postMsg: 'This milestone was completed and is no more interactive.'
          }}
          />
        )}

        {this.state.currentStep >= 2 && (
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
        )}

        {this.state.currentStep >= 3 && (
          <TimelinePost finish={this.finishStep3} postContent={{
            postId: 'a201',
            month: 'MAR',
            date: '29',
            title: 'Final designs',
            inProgress: (this.state.currentStep <= 3),
            isCompleted: (this.state.currentStep > 3),
            postMsg: 'Now pick the designs',
            content: [{
              id: 'a103',
              type: 'submission-selection',
              checkpointHeading: 'Select the top 5 design variants for our next round',
              selectedHeading: 'Selected designs',
              rejectedHeading: 'Rejected designs',
              inProgress: (this.state.currentStep <= 3),
              isCompleted: (this.state.currentStep > 3),
              submissions: [
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 1',
                  link: 'https://marvelapp.com/44b43db',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 3),
                  isCompleted: (this.state.currentStep > 3),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 2',
                  link: 'https://marvelapp.com/82346d5',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 3),
                  isCompleted: (this.state.currentStep > 3),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 3',
                  link: 'https://marvelapp.com/82346d5',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 3),
                  isCompleted: (this.state.currentStep > 3),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 4',
                  link: 'https://marvelapp.com/44b43db',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 3),
                  isCompleted: (this.state.currentStep > 3),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 5',
                  link: 'https://marvelapp.com/44b43db',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 3),
                  isCompleted: (this.state.currentStep > 3),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 6',
                  link: 'https://marvelapp.com/82346d5',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 3),
                  isCompleted: (this.state.currentStep > 3),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 7',
                  link: 'https://marvelapp.com/44b43db',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 3),
                  isCompleted: (this.state.currentStep > 3),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 8',
                  link: 'https://marvelapp.com/44b43db',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 3),
                  isCompleted: (this.state.currentStep > 3),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 9',
                  link: 'https://marvelapp.com/44b43db',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 3),
                  isCompleted: (this.state.currentStep > 3),
                }
              ]
            }
            ]
          }}
          />
        )}

        {this.state.currentStep >= 4 && (
          <TimelinePost finish={this.finishStep4} postContent={{
            postId: 'a109',
            inProgress: (this.state.currentStep <= 4),
            isCompleted: (this.state.currentStep > 4),
            month: 'MAR',
            date: '28',
            title: 'Final designs',
            postMsg: 'We will design the remaining screens and implementing the feedback from the 5 best designs you selected. Once the designs are completed, you will see them here and you’ll have to pick your 3 best options that we’re going to deliver to you in accordance with your requirements.',
            content: [{
              id: 'a103',
              type: 'progressBar',
              label: '6 days until designs are completed',
              progressPercent: 20,
              theme: 'light',
              inProgress: (this.state.currentStep <= 4),
              isCompleted: (this.state.currentStep > 4),
            },
            {
              id: 'a103',
              type: 'winner-selection',
              checkpointHeading: 'Select the top 3 winning designs',
              selectedHeading: 'Final designs',
              rejectedHeading: 'Rejected designs',
              inProgress: (this.state.currentStep <= 4),
              isCompleted: (this.state.currentStep > 4),
              submissions: [
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 1',
                  link: 'https://marvelapp.com/44b43db',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 4),
                  isCompleted: (this.state.currentStep > 4),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 2',
                  link: 'https://marvelapp.com/82346d5',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 4),
                  isCompleted: (this.state.currentStep > 4),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 3',
                  link: 'https://marvelapp.com/82346d5',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 4),
                  isCompleted: (this.state.currentStep > 4),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 4',
                  link: 'https://marvelapp.com/44b43db',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 4),
                  isCompleted: (this.state.currentStep > 4),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 5',
                  link: 'https://marvelapp.com/44b43db',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 4),
                  isCompleted: (this.state.currentStep > 4),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 6',
                  link: 'https://marvelapp.com/82346d5',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 4),
                  isCompleted: (this.state.currentStep > 4),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 7',
                  link: 'https://marvelapp.com/44b43db',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 4),
                  isCompleted: (this.state.currentStep > 4),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 8',
                  link: 'https://marvelapp.com/44b43db',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 4),
                  isCompleted: (this.state.currentStep > 4),
                },
                {
                  id: 'd101',
                  type: 'submission-selection-entry',
                  label: 'Design 9',
                  link: 'https://marvelapp.com/44b43db',
                  linkType: 'timeline-marvelapp',
                  isSelected: false,
                  inProgress: (this.state.currentStep <= 4),
                  isCompleted: (this.state.currentStep > 4),
                }
              ]
            }]
          }}
          />
        )}

        {this.state.currentStep >= 5 && (
          <TimelinePost finish={this.finishStep5} postContent={{
            postId: 'a109',
            inProgress: (this.state.currentStep <= 5),
            isCompleted: (this.state.currentStep > 5),
            month: 'MAR',
            date: '28',
            title: 'Design delivery',
            content: [{
              id: 'a100',
              type: 'edit-text',
              inProgress: (this.state.currentStep <= 5),
              isCompleted: (this.state.currentStep > 5),
            }]
          }} 
          />
        )}

        {this.state.currentStep >= 6 && (
          <TimelinePost finish={this.finishStep6} postContent={{
            postId: 'a109',
            inProgress: (this.state.currentStep <= 6),
            isCompleted: (this.state.currentStep > 6),
            month: 'MAR',
            date: '28',
            title: 'Complete specification',
            postMsg: 'Please review and answer all the questions on the specification document before we can proceed',
            content: [{
              id: 'a100',
              type: 'specification',
              inProgress: (this.state.currentStep <= 6),
              isCompleted: (this.state.currentStep > 6),
            }]
          }} 
          />
        )}
      </div>
    )
  }
}

export default Timeline
