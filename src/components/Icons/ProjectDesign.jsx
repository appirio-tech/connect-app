// TODO: Modify this component to use .svg icons instead of .png assets.

import React from 'react'
import Black from '../../assets/images/icon-project-design-black.png'
import Blue from '../../assets/images/icon-project-design-blue.png'

function ProjectDesign(props) {
  const i = props.color === 'black' ? Black : Blue
  const s = props.size
  return (
    <img className="Icon ProjectDesign" src={i} width={s} />
  )
}

export default ProjectDesign
