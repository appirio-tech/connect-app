import React from 'react'
import V3Template from './V3Template'
import PhaseCard from '../components/v3/PhaseCard'
import GenericMenu from '../components/v3/GenericMenu'
import './V3ComponentDemo.scss'

class V3PhaseCard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="v3-component-demolist">
        <V3Template>
          <div styleName="viewport">

            <h2 styleName="group-title">PhaseCard: default state</h2>

            <PhaseCard
              attr={{
                title: 'User Interface Design',
                type: 'design',
                duration: '10 days',
                startEndDates: 'Mar 15–Apr 4',
                posts: '8 posts',
                price: '$8,500',
                paidStatus: 'Paid in full',
                status: 'Delivered'
              }}
            >
              {/* phase card expanded view content */}
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
              <div styleName="placeholder-data">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem sunt rem maiores quibusdam. Deserunt, veniam nesciunt. Dolor possimus animi quia blanditiis soluta? Veniam, ducimus. Officia tenetur libero est vitae a.
              </div>
            </PhaseCard>

            <h2 styleName="group-title">PhaseCard: in-progress state</h2>

            <PhaseCard
              attr={{
                title: 'Frontend Part 1, Microservices Architecture ',
                type: 'design',
                duration: '10 days',
                startEndDates: 'Mar 15–Apr 4',
                posts: '8 posts',
                price: '$10,000',
                paidStatus: '$3,500 remaining',
                status: 'inProgress',
                progressInPercent: 5
              }}
            >
              {/* phase card expanded view content */}
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
              <div styleName="placeholder-data">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem sunt rem maiores quibusdam. Deserunt, veniam nesciunt. Dolor possimus animi quia blanditiis soluta? Veniam, ducimus. Officia tenetur libero est vitae a.
              </div>
            </PhaseCard>

            <h2 styleName="group-title">PhaseCard: planned state</h2>

            <PhaseCard
              attr={{
                title: 'Frontend Part 2, Backend Development ',
                type: 'design',
                duration: '21 days',
                startEndDates: 'Apr 5-24',
                posts: '8 posts',
                price: '$10,000',
                paidStatus: 'Quoted',
                status: 'planned'
              }}
            >
              {/* phase card expanded view content */}
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
              <div styleName="placeholder-data">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem sunt rem maiores quibusdam. Deserunt, veniam nesciunt. Dolor possimus animi quia blanditiis soluta? Veniam, ducimus. Officia tenetur libero est vitae a.
              </div>
            </PhaseCard>

          </div>
        </V3Template>
      </div>
    )
  }
}

export default V3PhaseCard