import React, {PropTypes} from 'react'
import PanelProject from '../PanelProject/PanelProject'

const wrapInPanel = (CompositeComponent) => (
  (props) => (
    <PanelProject>
      <PanelProject.Heading>
        { props.title }
      </PanelProject.Heading>
      <CompositeComponent {...props} />
    </PanelProject>
  )
)

export default wrapInPanel
