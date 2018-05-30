import React from 'react'
import V3Template from './V3Template'
import Timeline from '../components/v3/Timeline'
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

        </V3Template>
      </div >
    )
  }
}

export default V3ComponentDemo