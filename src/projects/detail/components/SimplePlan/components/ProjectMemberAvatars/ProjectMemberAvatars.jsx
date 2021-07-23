import React from 'react'
import PT from 'prop-types'
import ProjectManagerAvatars from '../../../../../list/components/Projects/ProjectManagerAvatars'

import './ProjectMemberAvatars.scss'

class ProjectMemberAvatars extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      shownNum: null
    }
  }

  componentDidMount() {
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.borderBoxSize) {
          const borderBoxSize = Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0]: entry.borderBoxSize

          const numAvatarsToShow = Math.floor(borderBoxSize.inlineSize / this.props.size)
          if (numAvatarsToShow !== this.props.maxShownNum) {
            this.setState({ shownNum: numAvatarsToShow })
          }
        }
      }
    })
    this.resizeObserver.observe(this.ref)
  }

  componentWillUnmount() {
    this.resizeObserver.unobserve(this.ref)
  }

  render() {
    const { members, maxShownNum, size } = this.props
    const { shownNum } = this.state

    const numAvatarsToShow = shownNum || maxShownNum

    return (
      <div
        ref={ref => this.ref = ref}
        styleName={`project-member-avatars size-${size}`}
      >
        <ProjectManagerAvatars
          managers={members}
          maxShownNum={numAvatarsToShow}
          size={size}
        />
      </div>
    )
  }
}

ProjectMemberAvatars.propTypes = {
  members: PT.arrayOf(PT.shape()),
  maxShownNum: PT.number,
  size: PT.number,
}

export default ProjectMemberAvatars
