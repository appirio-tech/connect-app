/**
 * Workstreams stages section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'

import Section from '../Section'
import WorkList from './WorkList'
import WorkstreamsEmpty from './components/workstreams/WorkstreamsEmpty'

const Workstreams = ({
  workstreams,
  addWorkForWorkstream,
  timelines,
  inputDesignWorks,
  isManageUser,
}) => (
  workstreams.length > 0 ? (
    <Section>
      {workstreams.map((workstream) => (
        <WorkList
          key={`workstream-${workstream.id}`}
          workstream={workstream}
          addWorkForWorkstream={addWorkForWorkstream}
          timelines={timelines}
          inputDesignWorks={inputDesignWorks}
        />
      ))}
    </Section>
  ) : (
    <WorkstreamsEmpty isManageUser={isManageUser} />
  )
)

Workstreams.propTypes = {
  workstreams: PT.arrayOf(PT.shape({
    id: PT.number.isRequired,
    name: PT.string.isRequired,
    status: PT.string.isRequired,
    description: PT.string,
  })).isRequired,
  addWorkForWorkstream: PT.func.isRequired,
  timelines: PT.array.isRequired,
  inputDesignWorks: PT.func.isRequired,
  isManageUser: PT.bool,
}

export default withRouter(Workstreams)
