import React from 'react'
import SecondaryToolBarContainer from './detail/containers/SecondaryToolBarContainer'
import './ProjectLayout.scss'

const ProjectViewLayout = ({
  main,
}) => (
  <div className="content-pane">
    <SecondaryToolBarContainer />
    {main}
  </div>
)

export default ProjectViewLayout
