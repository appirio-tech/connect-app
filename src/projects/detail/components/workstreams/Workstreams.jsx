/**
 * Workstreams stages section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'

import Section from '../Section'
import WorkList from './WorkList'
import WorkstreamsEmpty from './WorkstreamsEmpty'

const Workstreams = ({
  workstreams,
  addWorkForWorkstream,
  timelines,
  inputDesignWorks,
  startDesignReview,
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
          startDesignReview={startDesignReview}
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
  timelines: PT.object.isRequired,
  inputDesignWorks: PT.func.isRequired,
  startDesignReview: PT.func.isRequired,
  isManageUser: PT.bool,
}

export default withRouter(Workstreams)
