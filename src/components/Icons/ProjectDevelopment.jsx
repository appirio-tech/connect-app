// TODO: Modify this component to use .svg icons instead of .png assets.

import React from 'react'
import Black from '../../assets/images/icon-project-development-black.png'
import Blue from '../../assets/images/icon-project-development-blue.png'

function ProjectDevelopment(props) {
  const i = props.color === 'black' ? Black : Blue
  const s = props.size
  return (
    <img className="Icon ProjectDevelopment" src={i} width={s} />
  )
}

export default ProjectDevelopment
