/**
 * Milestone copilots
 */
import React from 'react'
import PT from 'prop-types'
import uncontrollable from 'uncontrollable'
import { Gateway } from 'react-gateway'
import ProjectManagerAvatars from '../../../../../list/components/Projects/ProjectManagerAvatars'
import AddCopilotsSidebar from '../AddCopilotsSidebar'
import IconDots from '../../../../../../assets/icons/icon-dots.svg'

import './MilestoneCopilots.scss'


function MilestoneCopilots({
  open,
  setOpen,
  edit,
  copilots,
  projectMembers,
  onAdd,
  onRemove
}) {
  const ScrollLock = React.createClass ({
    componentDidMount() {
      const scrollbarWidth = window.innerWidth - document.body.clientWidth
      document.body.style.setProperty('overflow', 'hidden')
      document.body.style.setProperty('margin-right', `${scrollbarWidth}px`)
    },

    componentWillUnmount() {
      document.body.style.removeProperty('overflow')
      document.body.style.removeProperty('margin-right')
    },

    render() {
      return null
    }
  })

  return edit ? (
    <span styleName="milestone-copilots">
      <button type="button" className="tc-btn tc-btn-default" styleName="edit-copilots-button" onClick={() => setOpen(!open)}>
        <IconDots />
      </button>
      {open  && (
        <Gateway into="right-sidebar">
          <ScrollLock />
          <AddCopilotsSidebar
            copilots={copilots}
            projectMembers={projectMembers}
            onClose={() => setOpen(false)}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        </Gateway>
      )}
    </span>
  ) : (
    <ProjectManagerAvatars managers={copilots} />
  )
}


MilestoneCopilots.propTypes = {
  edit: PT.bool,
  copilots: PT.arrayOf(PT.shape()),
  projectMembers: PT.arrayOf(PT.shape()),
  onAdd: PT.func,
  onRemove: PT.func,
}

export default uncontrollable(MilestoneCopilots, {
  open: 'setOpen'
})
