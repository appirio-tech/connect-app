// TODO: Modify this component to use .svg icons instead of .png assets.

import React from 'react'
import Black from '../../assets/images/icon-project-prototype-black.png'
import Blue from '../../assets/images/icon-project-prototype-blue.png'

function ProjectPrototype(props) {
  const i = props.color === 'black' ? Black : Blue
  const s = props.size
  return (
    <img className="Icon ProjectPrototype" src={i} width={s} />
  )
}

export default ProjectPrototype
