import React from 'react'
import V3Template from './V3Template'
import Timeline from '../components/v3/Timeline'
import './V3ComponentDemo.scss'
import qs from 'query-string'

// path = '/V3ComponentTimelineDemo'
class V3ComponentDemo extends React.Component {
  constructor(props) {
    super(props)
    const params = qs.parse(this.props.location.search)
    this.state = {
      section: params.section ? parseInt(params.section): 3
    }
  }

  componentDidUpdate() {
    const params = qs.parse(this.props.location.search)
    const newSection = params.section ? parseInt(params.section): 3
    if (this.state.section !== newSection) {
      window.location.reload()
    }
  }

  render() {
    return (
      <div styleName="v3-component-demolist">
        <V3Template>
          <div styleName="viewport">
            <h2 styleName="group-title">Timeline</h2>
            <Timeline section={this.state.section} />
          </div>

        </V3Template>
      </div >
    )
  }
}

export default V3ComponentDemo