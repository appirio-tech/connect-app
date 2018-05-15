import React from 'react'
import { NavLink } from 'react-router-dom'
import TimelinePost from '../components/v3/TimelinePost'
import './V3ComponentDemo.scss'

class V3ComponentSubmissionSelectionDemo extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="v3-component-demolist">
        <section>
          <div styleName="viewport">
            <h2 styleName="group-title">Demo Links</h2>
            <ul>
              <li><NavLink to="/V3ComponentDemo"> Progress & menu components </NavLink></li>
              <li><NavLink to="/V3ComponentTimelineDemo"> Timeline & Child Timeline components </NavLink></li>
              <li><NavLink to="/V3ComponentPostcardDemo"> Posts card and post feed components </NavLink></li>
              <li><NavLink to="/V3ComponentSubmissionSelectionDemo"> Submission selection component </NavLink></li>
              <li><NavLink to="/V3ComponentWinnerSelectionDemo"> Winner selection component </NavLink></li>
              <li><NavLink to="/V3ComponentAlertDemo"> Alert component </NavLink></li>
            </ul>

            <h2 styleName="group-title">Final design winners selection</h2>
            <h3>Winner SELECTION</h3>


            <TimelinePost postContent={{
              postId: 'a201',
              month: 'MAR',
              date: '29',
              title: 'Final designs',
              inProgress: true,
              postMsg: 'Now pick the designs',
              content: [{
                id: 'a103',
                type: 'winner-selection',
                checkpointHeading: 'Select the top 3 winning designs',
                selectedHeading: 'Final designs',
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

        </section>
      </div >
    )
  }
}

export default V3ComponentSubmissionSelectionDemo