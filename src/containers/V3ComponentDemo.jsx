import React from 'react'
import V3Template from './V3Template'
import ProjectProgress from '../components/v3/ProjectProgress'
import GenericMenu from '../components/v3/GenericMenu'
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
         
            <h2 styleName="group-title">Project plan progress bar</h2>
            <h3>PROGRESS</h3>
            <ProjectProgress
              labelDayStatus="Day 10 of 101"
              labelSpent="Spent $15,000"
              labelStatus="10% done"
              progressPercent="10"
              theme="default-theme"
            />
            <h3>PROGRESS</h3>
            <ProjectProgress
              labelDayStatus="Day 98 (3 days ahead of schedule)"
              labelSpent="Spent $15,000"
              labelStatus="Completed"
              progressPercent="100"
              theme="default-theme"
            />
          </div>

          <h2 styleName="group-title">Generic menu</h2>
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

        </V3Template>
      </div >
    )
  }
}

export default V3ComponentDemo