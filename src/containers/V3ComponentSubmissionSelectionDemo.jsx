import React from 'react'
import V3Template from './V3Template'
import TimelinePost from '../components/v3/TimelinePost'
import './V3ComponentDemo.scss'

class V3ComponentSubmissionSelectionDemo extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="v3-component-demolist">
        <V3Template>
          <div styleName="viewport">

            <h2 styleName="group-title">Design checkpoint selection states</h2>
            <h3>SUBMISSION SELECTION</h3>


            <TimelinePost postContent={{
              postId: 'a201',
              month: 'MAR',
              date: '29',
              title: 'Final designs',
              inProgress: true,
              postMsg: 'Now pick the designs',
              content: [{
                id: 'a103',
                type: 'submission-selection',
                checkpointHeading: 'Select the top 5 design variants for our next round',
                selectedHeading: 'Selected designs',
                rejectedHeading: 'Rejected designs',
                submissions: [
                  {
                    id: 'd101',
                    type: 'submission-selection-entry',
                    label: 'Design 1',
                    link: 'https://marvelapp.com/44b43db',
                    linkType: 'timeline-marvelapp',
                    isSelected: false
                  },
                  {
                    id: 'd101',
                    type: 'submission-selection-entry',
                    label: 'Design 2',
                    link: 'https://marvelapp.com/82346d5',
                    linkType: 'timeline-marvelapp',
                    isSelected: false
                  },
                  {
                    id: 'd101',
                    type: 'submission-selection-entry',
                    label: 'Design 3',
                    link: 'https://marvelapp.com/82346d5',
                    linkType: 'timeline-marvelapp',
                    isSelected: false
                  },
                  {
                    id: 'd101',
                    type: 'submission-selection-entry',
                    label: 'Design 4',
                    link: 'https://marvelapp.com/44b43db',
                    linkType: 'timeline-marvelapp',
                    isSelected: false
                  },
                  {
                    id: 'd101',
                    type: 'submission-selection-entry',
                    label: 'Design 5',
                    link: 'https://marvelapp.com/44b43db',
                    linkType: 'timeline-marvelapp',
                    isSelected: false
                  },
                  {
                    id: 'd101',
                    type: 'submission-selection-entry',
                    label: 'Design 6',
                    link: 'https://marvelapp.com/82346d5',
                    linkType: 'timeline-marvelapp',
                    isSelected: false
                  },
                  {
                    id: 'd101',
                    type: 'submission-selection-entry',
                    label: 'Design 7',
                    link: 'https://marvelapp.com/44b43db',
                    linkType: 'timeline-marvelapp',
                    isSelected: false
                  },
                  {
                    id: 'd101',
                    type: 'submission-selection-entry',
                    label: 'Design 8',
                    link: 'https://marvelapp.com/44b43db',
                    linkType: 'timeline-marvelapp',
                    isSelected: false
                  },
                  {
                    id: 'd101',
                    type: 'submission-selection-entry',
                    label: 'Design 9',
                    link: 'https://marvelapp.com/44b43db',
                    linkType: 'timeline-marvelapp',
                    isSelected: false
                  }
                ]
              }
              ]
            }}
            />
          </div>

        </V3Template>
      </div >
    )
  }
}

export default V3ComponentSubmissionSelectionDemo