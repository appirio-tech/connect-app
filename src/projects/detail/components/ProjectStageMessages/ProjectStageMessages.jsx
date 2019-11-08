import React from 'react'
import PT from 'prop-types'
import _ from 'lodash'
import moment from 'moment'

import Sticky from '../../../../components/Sticky'
import { SCROLL_TO_MARGIN } from '../../../../config/constants'

import './ProjectStageMessages.scss'

class ProjectStageMessages extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isShown: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    const phaseIdOrder = _.map(this.props.phases, 'id')

    const nextPhaseOrder = _.sortBy(nextProps.phases, [(phase) => (
      phase.startDate ? moment(phase.startDate).valueOf() : +Infinity
    )])
    const nextIdPhaseOrder = _.map(nextPhaseOrder, 'id')

    const isOrderChanged = !_.isEqual(phaseIdOrder, nextIdPhaseOrder)

    if (isOrderChanged && !this.state.isShown) {
      this.setState({ isShown: true })
    }
  }

  render() {
    const { isShown } = this.state

    return (
      isShown ? (
        <Sticky top={SCROLL_TO_MARGIN} innerZ={999}>
          <div styleName="container">
            <p styleName="message">Phase order is changed, please reload page to view changes</p>
            <div styleName="controls">
              <a href={location.href} className="tc-btn tc-btn-primary">Reload</a>
            </div>
          </div>
        </Sticky>
      ) : null
    )
  }
}

ProjectStageMessages.propTypes = {
  phases: PT.array.isRequired,
}

export default ProjectStageMessages
