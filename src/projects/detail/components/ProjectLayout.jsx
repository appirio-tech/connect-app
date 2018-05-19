import React from 'react'
import SecondaryToolBarContainer from '../containers/SecondaryToolBarContainer'
import './ProjectLayout.scss'

const ProjectViewLayout = ({
  main,
}) => (
  <div>
    <div styleName="secondary-toolbar">
      <SecondaryToolBarContainer />
    </div>
    {main}
  </div>
)

export default ProjectViewLayout
